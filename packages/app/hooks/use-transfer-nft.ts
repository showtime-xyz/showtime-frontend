import { useReducer } from "react";

import { ethers } from "ethers";

import transfererAbi from "app/abi/ShowtimeMT.json";
import { useSignerAndProvider } from "app/hooks/use-signer-provider";
import { track } from "app/lib/analytics";
import { NFT } from "app/types";

import { useAlert } from "design-system/alert";

type TransferNFTType = {
  status:
    | "idle"
    | "transfering"
    | "transferingError"
    | "transferingSuccess"
    | "transactionInitiated";

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
    case "transactionInitiated":
      return {
        ...state,
        status: "transactionInitiated",
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
  const Alert = useAlert();
  const [state, dispatch] = useReducer(
    transferNFTReducer,
    initialTransferNFTState
  );

  const { getSignerAndProvider } = useSignerAndProvider();

  const transferToken = async ({
    nft,
    receiverAddress,
    quantity,
  }: UseTransferNFT) => {
    return new Promise<{ transaction: string; tokenId: number }>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        const result = await getSignerAndProvider();
        if (result) {
          const { signerAddress, signer, provider } = result;
          const contract = new ethers.Contract(
            //@ts-ignore
            nft.contract_address,
            transfererAbi,
            signer
          );

          const { data } = await contract.populateTransaction.safeTransferFrom(
            signerAddress,
            receiverAddress,
            nft.token_id,
            quantity,
            0
          );

          const transaction = await provider
            .send("eth_sendTransaction", [
              {
                data,
                from: signerAddress,
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
                reject("Your address is not approved for transfering");
              }

              reject("Something went wrong");
            });

          dispatch({
            type: "transactionInitiated",
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
      }
    );
  };

  const transferTokenPipeline = async (params: UseTransferNFT) => {
    try {
      dispatch({ type: "transfering" });
      const response = await transferToken(params);
      dispatch({
        type: "transferingSuccess",
        tokenId: response.tokenId,
        transaction: response.transaction,
      });
      track("NFT Transferred");
    } catch (e) {
      dispatch({ type: "transferingError" });
      Alert.alert("Sorry! Something went wrong");
    }
  };

  return { state, startTransfer: transferTokenPipeline };
};
