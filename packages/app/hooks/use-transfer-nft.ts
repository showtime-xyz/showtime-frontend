import { useContext, useReducer, useCallback, useRef } from "react";
import { Alert } from "react-native";

import { ethers } from "ethers";

import transfererAbi from "app/abi/ShowtimeMT.json";
import { AppContext } from "app/context/app-context";
import { useWalletConnect } from "app/lib/walletconnect";
import { NFT } from "app/types";

import { getBiconomy } from "../utilities";
import { useCurrentUserAddress } from "./use-current-user-address";
import { useWeb3 } from "./use-web3";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

type TransferNFTType = {
  status: "idle" | "transfering" | "transferingError" | "transferingSuccess";

  tokenId?: string;
  transaction?: string;
};

const initialTransferNFTState: TransferNFTType = {
  status: "idle",
  tokenId: undefined,
  transaction: undefined,
};

const transferNFTReducer = (
  state: TransferNFTType,
  action: any
): TransferNFTType => {
  switch (action.type) {
    case "transfering":
      return {
        ...state,
        status: "transfering",
        tokenId: action?.tokenId,
        transaction: action?.transaction,
      };
    case "transferingError":
      return { ...state, status: "transferingError" };
    case "transferingSuccess":
      return {
        ...state,
        status: "transferingSuccess",
        tokenId: action.tokenId,
        transaction: action.transaction,
      };
    default:
      return state;
  }
};

export type UseTransferNFT = {
  nft: NFT;
  receiverAddress: string;
  quantity: number;
};

export const useTransferNFT = () => {
  const [state, dispatch] = useReducer(
    transferNFTReducer,
    initialTransferNFTState
  );
  const biconomyRef = useRef<any>();
  const { userAddress } = useCurrentUserAddress();
  const { web3 } = useWeb3();
  const context = useContext(AppContext);

  const connector = useWalletConnect();

  async function transferToken({
    nft,
    receiverAddress,
    quantity,
  }: UseTransferNFT) {
    return new Promise<{ transaction: string; tokenId: number }>(
      async (resolve, reject) => {
        biconomyRef.current = await (
          await getBiconomy(connector, web3)
        ).biconomy;

        const contract = new ethers.Contract(
          //@ts-ignore
          nft.contract_address,
          transfererAbi,
          biconomyRef.current.getSignerByAddress(userAddress)
        );

        const { data } = await contract.populateTransaction.safeTransferFrom(
          userAddress,
          receiverAddress,
          nft.token_id,
          quantity,
          0
        );
        const provider = biconomyRef.current.getEthersProvider();

        console.log("** transfer: opening wallet for signing **");

        const transaction = await provider
          .send("eth_sendTransaction", [
            {
              data,
              from: userAddress,
              to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
              signatureType: "EIP712_SIGN",
            },
          ])
          .catch((error: any) => {
            console.error(error);

            if (error.code === 4001) {
              // https://eips.ethereum.org/EIPS/eip-1193
              reject("Your request is rejected.");
            }

            if (
              JSON.parse(
                error?.body || error?.error?.body || "{}"
              )?.error?.message?.includes("caller is not transferer")
            ) {
              console.log("Your address is not approved for transfering");
              reject("Your address is not approved for transfering");
            }

            console.log("Something went wrong", error);
            reject("Something went wrong");
          });

        dispatch({
          type: "transfering",
          transaction: transaction,
        });

        provider.once(transaction, (result: any) => {
          resolve({
            tokenId: contract.interface
              .decodeFunctionResult("issueToken", result.logs[0].data)[0]
              .toNumber(),
            transaction: transaction,
          });
        });
      }
    );
  }

  const transferTokenPipeline = useCallback(
    async (params: UseTransferNFT) => {
      if (userAddress) {
        try {
          dispatch({ type: "transfering" });
          console.log("** Begin transfer **");
          const response = await transferToken(params);
          dispatch({
            type: "transferingSuccess",
            tokenId: response.tokenId,
            transaction: response.transaction,
          });
          console.log("** transfer success **");
        } catch (e) {
          dispatch({ type: "transferingError" });
          Alert.alert("Sorry! Something went wrong");
          throw e;
        }
      } else {
        Alert.alert(
          "Sorry! We can't find your user address. Please login with a wallet or email/phone"
        );
      }
    },
    [userAddress, state, dispatch]
  );

  return { state, startTransfer: transferTokenPipeline };
};
