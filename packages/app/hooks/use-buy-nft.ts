import { useReducer } from "react";
import { Platform } from "react-native";

import axios from "axios";
import { ethers } from "ethers";

import ierc20MetaTx from "app/abi/IERC20MetaTx.json";
import ierc20MetaTxNonces from "app/abi/IERC20MetaTxNonces.json";
import iercPermit20Abi from "app/abi/IERC20Permit.json";
import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { useSignerAndProvider } from "app/hooks/use-signer-provider";
import { track } from "app/lib/analytics";
import { CURRENCY_NAMES, LIST_CURRENCIES } from "app/lib/constants";
import { SOL_MAX_INT } from "app/lib/constants";
import getWeb3Modal from "app/lib/web3-modal";
import { NFT } from "app/types";
import { parseBalance } from "app/utilities";

type Status =
  | "idle"
  | "loading"
  | "transactionInitiated"
  | "verifyingUserBalance"
  | "verifyingAllowance"
  | "needsAllowance"
  | "noBalance"
  | "error"
  | "buyingSuccess"
  | "grantingAllowance"
  | "grantingAllowanceError"
  | "reset";

type BuyNFTState = {
  status: Status;
  error?: string;
  transaction?: any;
};

type BuyNFTAction = {
  type: Status;
  payload?: { error?: string; transaction?: any };
};

const initialState: BuyNFTState = {
  status: "idle",
  error: undefined,
  transaction: null,
};

const buyNFTReducer = (
  state: BuyNFTState,
  action: BuyNFTAction
): BuyNFTState => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "reset":
      return { ...initialState };
    case "verifyingUserBalance":
    case "noBalance":
    case "verifyingAllowance":
    case "needsAllowance":
    case "grantingAllowance":
    case "grantingAllowanceError":
      return { ...state, status: action.type };
    case "error":
      return { ...state, status: "error", error: action.payload?.error };
    case "transactionInitiated":
      return {
        ...state,
        status: "transactionInitiated",
        transaction: action.payload?.transaction,
      };
    case "buyingSuccess":
      return { ...state, status: "buyingSuccess" };
    default:
      return state;
  }
};

export const useBuyNFT = () => {
  const [state, dispatch] = useReducer(buyNFTReducer, initialState);
  const { getSignerAndProvider } = useSignerAndProvider();

  const buyNFT = async ({ nft, quantity }: { nft: NFT; quantity: number }) => {
    if (!nft || !nft.listing) return;
    if (Platform.OS !== "web") return;

    dispatch({ type: "loading" });
    const result = await getSignerAndProvider();
    if (result) {
      const { signer, signerAddress, provider } = result;

      const contract = new ethers.Contract(
        //@ts-ignore
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        marketplaceAbi,
        signer
      );

      const ercContract = new ethers.Contract(
        LIST_CURRENCIES[nft.listing.currency],
        iercPermit20Abi,
        signer
      );

      const basePrice = parseBalance(
        nft.listing.min_price.toString(),
        LIST_CURRENCIES[nft.listing.currency]
      );

      dispatch({ type: "verifyingUserBalance" });

      if (!(await ercContract.balanceOf(signerAddress)).gte(basePrice)) {
        dispatch({ type: "noBalance" });
        return;
      }

      dispatch({ type: "verifyingAllowance" });
      const allowance = await ercContract.allowance(
        signerAddress,
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT
      );

      if (!allowance.gte(basePrice)) {
        dispatch({ type: "needsAllowance" });
        return;
      }

      const { data } = await contract.populateTransaction.buy(
        nft.listing.sale_identifier,
        nft.token_id,
        quantity,
        basePrice,
        LIST_CURRENCIES[nft.listing.currency],
        signerAddress
      );

      const transaction = await provider
        .send("eth_sendTransaction", [
          {
            data,
            from: signerAddress,
            to: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
            signatureType: "EIP712_SIGN",
          },
        ])
        .catch((error: any) => {
          console.error("buy transaction failed ", error);
          dispatch({
            type: "error",
            payload: { error: "Something went wrong!" },
          });
        });

      if (transaction) {
        dispatch({ type: "transactionInitiated", payload: { transaction } });
        provider.once(transaction, () => {
          dispatch({ type: "buyingSuccess" });
          track("NFT Purchased");
        });
      }
    }
  };

  const grantAllowance = async ({
    nft,
    quantity,
  }: {
    nft: NFT;
    quantity: number;
  }) => {
    const infurePolygonProvider = new ethers.providers.JsonRpcProvider(
      `https://polygon-${
        process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai" : "mainnet"
      }.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
    );

    if (nft.listing) {
      const tokenAddr = LIST_CURRENCIES[nft.listing.currency];
      if (!nft.listing) return;

      let permitRequest;

      dispatch({ type: "grantingAllowance" });
      try {
        const web3Modal = await getWeb3Modal();

        const web3 = new ethers.providers.Web3Provider(
          await web3Modal.connect()
        );

        if (
          [
            LIST_CURRENCIES.WETH,
            LIST_CURRENCIES.DAI,
            LIST_CURRENCIES.USDC,
          ].includes(tokenAddr)
        ) {
          const userAddress = await web3.getSigner().getAddress();
          let tokenContract, nonce;

          if (tokenAddr === LIST_CURRENCIES.USDC) {
            tokenContract = new ethers.Contract(
              tokenAddr,
              ierc20MetaTxNonces,
              infurePolygonProvider
            );

            nonce = await tokenContract.nonces(userAddress);
          } else {
            tokenContract = new ethers.Contract(
              tokenAddr,
              ierc20MetaTx,
              infurePolygonProvider
            );

            nonce = await tokenContract.getNonce(userAddress);
          }

          const metatx = {
            nonce,
            from: userAddress,
            functionSignature: tokenContract.interface.encodeFunctionData(
              "approve",
              [process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, SOL_MAX_INT]
            ),
          };

          const signature = await web3.getSigner()._signTypedData(
            {
              name: CURRENCY_NAMES[tokenAddr],
              version: "1",
              verifyingContract: tokenAddr,
              salt:
                process.env.NEXT_PUBLIC_CHAIN_ID == "mumbai"
                  ? "0x0000000000000000000000000000000000000000000000000000000000013881"
                  : "0x0000000000000000000000000000000000000000000000000000000000000089",
            },
            {
              MetaTransaction: [
                { name: "nonce", type: "uint256" },
                { name: "from", type: "address" },
                { name: "functionSignature", type: "bytes" },
              ],
            },
            metatx
          );

          permitRequest = {
            owner: metatx.from,
            fnSig: metatx.functionSignature,
            tokenAddr,
            signature,
          };
        } else {
          const tokenContract = new ethers.Contract(
            tokenAddr,
            iercPermit20Abi,
            infurePolygonProvider
          );

          const userAddress = await web3.getSigner().getAddress();
          const permit = {
            owner: userAddress,
            spender: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
            value: SOL_MAX_INT,
            nonce: await tokenContract.nonces(userAddress),
            deadline: Date.now() + 120,
          };

          const signature = await web3.getSigner()._signTypedData(
            {
              name: CURRENCY_NAMES[tokenAddr],
              version: "1",
              chainId:
                process.env.NEXT_PUBLIC_CHAIN_ID == "mumbai" ? 80001 : 137,
              verifyingContract: tokenAddr,
            },
            {
              Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" },
              ],
            },
            permit
          );

          permitRequest = {
            owner: permit.owner,
            deadline: permit.deadline,
            tokenAddr,
            signature,
          };
        }

        const transaction = await axios
          .post("/api/marketplace/permit", permitRequest)
          .then((res) => res.data);

        // since we sent the transaction on polygon chain, we listen it with infure provider
        infurePolygonProvider.once(transaction, () => {
          buyNFT({ nft, quantity });
        });
      } catch (error) {
        console.error("Allowance failed ", error);
        dispatch({ type: "grantingAllowanceError" });
      }
    }
  };

  const reset = () => {
    dispatch({ type: "reset" });
  };

  if (__DEV__) console.log("buy nft state ", state);

  return { buyNFT, state, grantAllowance, reset };
};
