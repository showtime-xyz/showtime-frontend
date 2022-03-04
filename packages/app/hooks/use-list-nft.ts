import { useContext, useRef, useReducer, useState } from "react";

import { ethers } from "ethers";

import minterAbi from "app/abi/ShowtimeMT.json";
import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { AppContext } from "app/context/app-context";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy, parseBalance } from "app/utilities";

export type ListNFT = {
  status:
    | "idle"
    | "listing"
    | "listingError"
    | "listingSuccess"
    | "approvalChecking"
    | "approvalRequesting"
    | "approvalError"
    | "approvalSuccess";
  transaction?: string;
};

type ListNFTAction = {
  type: ListNFT["status"];
  transaction?: string;
};

export type ListingValues = {
  editions: number;
  currency: string;
  price: number;
  nftId: string;
};

const initialState: ListNFT = {
  status: "idle",
  transaction: undefined,
};

const listNFTReducer = (state: ListNFT, action: ListNFTAction): ListNFT => {
  switch (action.type) {
    case "approvalRequesting":
      return {
        ...state,
        status: "approvalRequesting",
        transaction: undefined,
      };
    case "approvalSuccess":
      return {
        ...state,
        status: "approvalSuccess",
        transaction: action.transaction,
      };
    case "approvalChecking":
      return {
        ...state,
        status: "approvalChecking",
      };
    case "approvalError":
      return { ...state, status: "approvalError" };
    case "listing":
      return {
        ...state,
        status: "listing",
        transaction: undefined,
      };
    case "listingError":
      return { ...state, status: "listingError" };
    case "listingSuccess":
      return {
        ...state,
        status: "listingSuccess",
        transaction: action.transaction,
      };
    default:
      return state;
  }
};

export const useListNFT = () => {
  const [state, dispatch] = useReducer(listNFTReducer, initialState);
  const { web3 } = useWeb3();
  const connector = useWalletConnect();
  const context = useContext(AppContext);
  const biconomyRef = useRef<any>();
  const { userAddress: address } = useCurrentUserAddress();
  const MARKET_PLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;
  const MINTING_ADDRESS = process.env.NEXT_PUBLIC_MINTING_CONTRACT;

  const biconomy = async () => {
    const configureBiconomy = !biconomyRef.current;

    if (configureBiconomy) {
      biconomyRef.current = await (await getBiconomy(connector, web3)).biconomy;
    }

    return {
      signer: biconomyRef.current.getSignerByAddress(address),
      provider: biconomyRef.current.getEthersProvider(),
    };
  };

  /**
   * Before an NFT owner can list they must grant us approval
   */
  const requestingListingApproval = async () => {
    return await new Promise(async (resolve, reject) => {
      try {
        dispatch({ type: "approvalChecking" });
        const { signer, provider } = await biconomy();

        const mintContract = new ethers.Contract(
          //@ts-ignore
          MINTING_ADDRESS,
          minterAbi,
          signer
        );

        const isApprovedToList = await mintContract.isApprovedForAll(
          address,
          MARKET_PLACE_ADDRESS
        );

        console.log("isApprovedToList", isApprovedToList);
        if (isApprovedToList) {
          dispatch({ type: "approvalSuccess" });
          resolve(true);
        } else {
          dispatch({ type: "approvalRequesting" });
          const { data } =
            await mintContract.populateTransaction.setApprovalForAll(
              MARKET_PLACE_ADDRESS,
              true
            );

          const transaction = await provider.send("eth_sendTransaction", [
            {
              data,
              from: address,
              to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
              signatureType: "EIP712_SIGN",
            },
          ]);

          provider.once(transaction, () => {
            dispatch({ type: "approvalSuccess" });
            resolve(true);
          });
        }
      } catch (error) {
        dispatch({ type: "approvalError" });
        console.log("requestingListingApproval nft error", error);
        reject(false);
      }
    });
  };

  const listingToMarketPlace = async (listingValues: ListingValues) => {
    return await new Promise(async (resolve, reject) => {
      try {
        dispatch({ type: "listing" });
        const { signer, provider } = await biconomy();
        const marketContract = new ethers.Contract(
          //@ts-ignore
          MARKET_PLACE_ADDRESS,
          marketplaceAbi,
          signer
        );

        const { data } = await marketContract.populateTransaction.createSale(
          listingValues.nftId,
          listingValues.editions,
          parseBalance(listingValues.price.toString(), listingValues.currency),
          listingValues.currency
        );

        const transaction = await provider.send("eth_sendTransaction", [
          {
            data,
            from: address,
            to: MARKET_PLACE_ADDRESS,
            signatureType: "EIP712_SIGN",
          },
        ]);

        provider.once(transaction, () => {
          dispatch({ type: "listingSuccess" });
          resolve(true);
        });
      } catch (error) {
        dispatch({ type: "listingError" });
        console.log("listingToMarketPlace nft error", error);
        reject(false);
      }
    });
  };

  const listNFT = async (listingValues: ListingValues) => {
    try {
      await requestingListingApproval();
      await listingToMarketPlace(listingValues);
    } catch (error) {
      console.log("listing nft error", error);
    }
  };

  return {
    listNFT,
    state,
    dispatch,
  };
};
