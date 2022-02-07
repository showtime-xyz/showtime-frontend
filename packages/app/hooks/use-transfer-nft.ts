import { NFT } from 'app/types';
import { Alert } from "react-native";
import { useContext, useReducer, useCallback } from "react";
import {  getBiconomy } from "../utilities";
import { ethers } from "ethers";
import transfererAbi from "app/abi/ShowtimeMT.json";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { AppContext } from "../context/app-context";
import { useCurrentUserAddress } from "./use-current-user-address";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

type TransferNFTType = {
  status:
    | "idle"
    | "transfering"
    | "transferingError"
    | "transferingSuccess";

  tokenId?: string;
  transaction?: string;
};

const initialTransferNFTState: TransferNFTType = {
  status: "idle",
  tokenId: undefined,
  transaction: undefined,
};

const transferNFTReducer = (state: TransferNFTType, action: any): TransferNFTType => {
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
  const [state, dispatch] = useReducer(transferNFTReducer, initialTransferNFTState);
  const { userAddress } = useCurrentUserAddress();
  const context = useContext(AppContext);

  const connector = useWalletConnect();

  async function transferToken({
    nft,
    receiverAddress,
    quantity
  }: UseTransferNFT) {
    return new Promise<{ transaction: string; tokenId: number }>(
      async (resolve, reject) => {
        const { biconomy } = await getBiconomy(connector, context.web3);
      
        const contract = new ethers.Contract(
          //@ts-ignore
          nft.contract_address,
          transfererAbi,
          biconomy.getSignerByAddress(userAddress)
        );

        const { data } = await contract.populateTransaction.safeTransferFrom(
          userAddress,
          receiverAddress,
          nft.token_id,
          quantity,
          0, 
        );
        const provider = biconomy.getEthersProvider();

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
            // TODO: Add a proper error message. Find what 4001 means
            if (error.code === 4001) {
              reject("Something went wrong");
            }

            if (
              JSON.parse(
                error?.body || error?.error?.body || "{}"
              )?.error?.message?.includes("caller is not transferer")
            ) {
              console.log("Your address is not approved for transfering")
              reject("Your address is not approved for transfering");
            }

            console.log("Something went wrong")
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

  const transferTokenPipeline =  useCallback(async (params: UseTransferNFT) => {
    if (userAddress) {
      try {
        dispatch({ type: "transfering" });
        console.log("** Begin transfer **");
        const response = await transferToken(params)
        dispatch({
          type: "transferingSuccess",
          tokenId: response.tokenId,
          transaction: response.transaction,
        });
        console.log("** transfer success **");
      } catch (e) {
        dispatch({ type: "transferingError" });
        throw e;
      }
    } else {
      Alert.alert(
        "Sorry! We can't find your user address. Please login with a wallet or email/phone"
      );
    }
  }, [userAddress, state, dispatch])

  return { state, startTransfer: transferTokenPipeline };
};
