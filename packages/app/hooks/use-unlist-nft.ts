import { useReducer } from "react";

import { ethers } from "ethers";

import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { track } from "app/lib/analytics";

import { useSignerAndProvider } from "./use-signer-provider";

export type UnlistNFT = {
  status:
    | "idle"
    | "unlisting"
    | "unlistingError"
    | "unlistingSuccess"
    | "transactionInitiated";
  transactionHash?: string;
};

type UnlistNFTAction = {
  type: "status";
  status: UnlistNFT["status"];
  transactionHash?: string;
};

// Maps to market place smart contract listingId
export type UnlistingValue = number | undefined;

const initialState: UnlistNFT = {
  status: "idle",
  transactionHash: undefined,
};

const listNFTReducer = (
  state: UnlistNFT,
  action: UnlistNFTAction
): UnlistNFT => {
  switch (action.type) {
    case "status":
      return {
        ...state,
        status: action.status,
        transactionHash: action.transactionHash,
      };
    default:
      return state;
  }
};

export const useUnlistNFT = () => {
  const { getSignerAndProvider } = useSignerAndProvider();
  const [state, dispatch] = useReducer(listNFTReducer, initialState);

  const MARKET_PLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;

  const unlistingFromMarketPlace = async (listingId: UnlistingValue) => {
    return await new Promise(async (resolve, reject) => {
      try {
        const missingListingId = !listingId;

        if (missingListingId) {
          dispatch({ type: "status", status: "unlistingError" });
          throw "Attempting to unlist without a listingID";
        }

        dispatch({ type: "status", status: "unlisting" });

        const result = await getSignerAndProvider();

        if (result) {
          const { signer, signerAddress, provider } = result;

          const marketContract = new ethers.Contract(
            //@ts-ignore
            MARKET_PLACE_ADDRESS,
            marketplaceAbi,
            signer
          );

          const populatedTransaction =
            await marketContract.populateTransaction.cancelSale(listingId);

          const data = populatedTransaction.data;

          const transaction = await provider.send("eth_sendTransaction", [
            {
              data,
              from: signerAddress,
              to: MARKET_PLACE_ADDRESS,
              signatureType: "EIP712_SIGN",
            },
          ]);

          dispatch({
            type: "status",
            status: "transactionInitiated",
            transactionHash: transaction,
          });

          provider.once(transaction, () => {
            dispatch({
              type: "status",
              status: "unlistingSuccess",
              transactionHash: transaction,
            });
            track("NFT Unlisted");
            resolve(true);
          });
        }
      } catch (error) {
        dispatch({ type: "status", status: "unlistingError" });

        console.log("Error: Listing Request", error);
        reject(false);
      }
    });
  };

  const unlistNFT = async (listingId: UnlistingValue) => {
    try {
      await unlistingFromMarketPlace(listingId);
    } catch (error) {
      dispatch({ type: "status", status: "unlistingError" });
      console.log("Error: Listing Flow", error);
    }
  };

  console.log("unlisting nft state ", state);

  return {
    unlistNFT,
    state,
    dispatch,
  };
};
