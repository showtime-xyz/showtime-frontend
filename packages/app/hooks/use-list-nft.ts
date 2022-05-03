import { useReducer } from "react";

import { ethers } from "ethers";

import minterAbi from "app/abi/ShowtimeMT.json";
import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { useSignerAndProvider } from "app/hooks/use-signer-provider";
import { track } from "app/lib/analytics";
import { parseBalance } from "app/utilities";

export type ListNFT = {
  status:
    | "idle"
    | "listing"
    | "listingError"
    | "listingSuccess"
    | "approvalChecking"
    | "approvalRequesting"
    | "approvalError"
    | "approvalSuccess"
    | "transactionInitiated";
  transactionHash?: string;
};

type ListNFTAction = {
  type: "status";
  status: ListNFT["status"];
  transactionHash?: string;
};

export type ListingValues = {
  editions: number;
  currency: string;
  price: number;
  nftId: string;
};

const initialState: ListNFT = {
  status: "idle",
  transactionHash: undefined,
};

const listNFTReducer = (state: ListNFT, action: ListNFTAction): ListNFT => {
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

export const useListNFT = () => {
  const [state, dispatch] = useReducer(listNFTReducer, initialState);

  const { getSignerAndProvider } = useSignerAndProvider();
  const MARKET_PLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
  const MINTING_ADDRESS = process.env.NEXT_PUBLIC_MINTING_CONTRACT;

  /**
   * Check and request listing approval
   */
  const requestingListingApproval = async (params: {
    signer: any;
    signerAddress: string;
    provider: any;
  }) => {
    return await new Promise(async (resolve, reject) => {
      const { provider, signer, signerAddress } = params;
      try {
        const mintContract = new ethers.Contract(
          //@ts-ignore
          MINTING_ADDRESS,
          minterAbi,
          signer
        );

        const isApprovedToList = await mintContract.isApprovedForAll(
          signerAddress,
          MARKET_PLACE_ADDRESS
        );

        if (isApprovedToList) {
          dispatch({ type: "status", status: "approvalSuccess" });

          resolve(true);
        } else {
          dispatch({ type: "status", status: "approvalRequesting" });

          const populatedTransaction =
            await mintContract.populateTransaction.setApprovalForAll(
              MARKET_PLACE_ADDRESS,
              true
            );

          const data = populatedTransaction.data;

          const transaction = await provider.send("eth_sendTransaction", [
            {
              data,
              from: signerAddress,
              to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
              signatureType: "EIP712_SIGN",
            },
          ]);

          provider.once(transaction, () => {
            dispatch({ type: "status", status: "approvalSuccess" });

            resolve(true);
          });
        }
      } catch (error) {
        dispatch({ type: "status", status: "approvalError" });

        console.log("Error: Approval Request", error);
        reject(false);
      }
    });
  };

  const listingToMarketPlace = async (params: {
    signer: any;
    signerAddress: string;
    provider: any;
    listingValues: ListingValues;
  }) => {
    const { signer, signerAddress, provider, listingValues } = params;

    return await new Promise(async (resolve, reject) => {
      dispatch({ type: "status", status: "listing" });

      try {
        const marketContract = new ethers.Contract(
          //@ts-ignore
          MARKET_PLACE_ADDRESS,
          marketplaceAbi,
          signer
        );

        const populatedTransaction =
          await marketContract.populateTransaction.createSale(
            listingValues.nftId,
            listingValues.editions,
            parseBalance(
              listingValues.price.toString(),
              listingValues.currency
            ),
            listingValues.currency
          );

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
            status: "listingSuccess",
            transactionHash: transaction,
          });
          track("NFT Listed");
          resolve(true);
        });
      } catch (error) {
        dispatch({
          type: "status",
          status: "listingError",
        });

        console.log("Error: Listing Request", error);
        reject(false);
      }
    });
  };

  const listNFT = async (listingValues: ListingValues) => {
    try {
      dispatch({ type: "status", status: "approvalChecking" });
      const result = await getSignerAndProvider();
      if (result) {
        await requestingListingApproval(result);
        await listingToMarketPlace({ ...result, listingValues });
      }
    } catch (error) {
      dispatch({ type: "status", status: "listingError" });

      console.log("Error: Listing Flow", error);
    }
  };

  console.log("listing state ", state);
  return {
    listNFT,
    state,
    dispatch,
  };
};
