import { useReducer } from "react";

import { ethers } from "ethers";

import minterAbi from "app/abi/ShowtimeMT.json";
import { useSignerAndProvider } from "app/hooks/use-signer-provider";
import { track } from "app/lib/analytics";

type BurnNFTType = {
  status:
    | "idle"
    | "burning"
    | "burningError"
    | "burningSuccess"
    | "transactionInitiated";
  transaction?: string;
};

const initialBurnNFTState: BurnNFTType = {
  status: "idle",
  transaction: undefined,
};

const burnNFTReducer = (state: BurnNFTType, action: any): BurnNFTType => {
  switch (action.type) {
    case "burning":
      return {
        ...state,
        status: "burning",
        transaction: undefined,
      };
    case "burningError":
      return { ...state, status: "burningError" };
    case "burningSuccess":
      return {
        ...state,
        status: "burningSuccess",
        transaction: action.transaction,
      };
    case "transactionInitiated":
      return {
        ...state,
        status: "transactionInitiated",
        transaction: action.transaction,
      };
    default:
      return state;
  }
};

export type UseBurnNFT = {
  copies: number;
  tokenId: string;
};

export const useBurnNFT = () => {
  const [state, dispatch] = useReducer(burnNFTReducer, initialBurnNFTState);
  const { getSignerAndProvider } = useSignerAndProvider();

  async function burnToken({ ...params }: UseBurnNFT) {
    return new Promise<{ transaction: string }>(async (resolve, reject) => {
      const result = await getSignerAndProvider();
      if (result) {
        const { provider, signer, signerAddress } = result;

        const contract = new ethers.Contract(
          //@ts-ignore
          process.env.NEXT_PUBLIC_MINTING_CONTRACT,
          minterAbi,
          signer
        );

        const { data } = await contract.populateTransaction.burn(
          signerAddress,
          params.tokenId,
          params.copies
        );

        console.log("** burning: opening wallet for signing **");

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
            // TODO: Add a proper error message. Find what 4001 means
            if (error.code === 4001) {
              reject("Something went wrong");
            }

            reject("Something went wrong");
          });

        dispatch({ type: "transactionInitiated", transaction });

        console.log("transaction hash ", transaction);

        provider.once(transaction, () => resolve({ transaction: transaction }));
      }
    });
  }

  async function burnTokenPipeline(params: UseBurnNFT) {
    try {
      dispatch({ type: "burning" });
      console.log("** Begin burning **");

      const response = await burnToken({ ...params });
      dispatch({ type: "burningSuccess", transaction: response.transaction });
      track("NFT Burned");

      console.log("** burning success **");
    } catch (e) {
      console.error("error while burning ", e);
      dispatch({ type: "burningError" });
    }
  }

  console.log("state ", state);

  return { state, startBurning: burnTokenPipeline };
};
