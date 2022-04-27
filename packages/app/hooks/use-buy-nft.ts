import { useReducer } from "react";

import { ethers } from "ethers";

import iercPermit20Abi from "app/abi/IERC20Permit.json";
import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { useSignerAndProvider } from "app/hooks/use-signer-provider";
import { LIST_CURRENCIES } from "app/lib/constants";
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
  | "buyingSuccess";

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
    case "verifyingUserBalance":
      return { ...state, status: "verifyingUserBalance" };
    case "noBalance":
      return { ...state, status: "noBalance" };
    case "verifyingAllowance":
      return { ...state, status: "verifyingAllowance" };
    case "needsAllowance":
      return { ...state, status: "needsAllowance" };
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
        provider.once(transaction, () => dispatch({ type: "buyingSuccess" }));
      }
    }
  };

  if (__DEV__) console.log("buy nft state ", state);

  return { buyNFT, state };
};
