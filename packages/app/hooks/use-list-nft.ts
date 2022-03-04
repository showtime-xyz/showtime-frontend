import { useRef, useReducer } from "react";

import { ethers } from "ethers";

import minterAbi from "app/abi/ShowtimeMT.json";
import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
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
};

type ListNFTAction = {
  type: "status";
  status: ListNFT["status"];
};

export type ListingValues = {
  editions: number;
  currency: string;
  price: number;
  nftId: string;
};

const initialState: ListNFT = {
  status: "idle",
};

const listNFTReducer = (state: ListNFT, action: ListNFTAction): ListNFT => {
  switch (action.type) {
    case "status":
      return {
        ...state,
        status: state.status,
      };
    default:
      return state;
  }
};

export const useListNFT = () => {
  const biconomyRef = useRef<any>();
  const connector = useWalletConnect();
  const { web3 } = useWeb3();
  const { userAddress: address } = useCurrentUserAddress();
  const [state, dispatch] = useReducer(listNFTReducer, initialState);

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
   * Check and request listing approval
   */
  const requestingListingApproval = async () => {
    return await new Promise(async (resolve, reject) => {
      try {
        dispatch({ type: "status", status: "approvalChecking" });

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
              from: address,
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

  const listingToMarketPlace = async (listingValues: ListingValues) => {
    return await new Promise(async (resolve, reject) => {
      try {
        dispatch({ type: "status", status: "listing" });

        const { signer, provider } = await biconomy();
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
            from: address,
            to: MARKET_PLACE_ADDRESS,
            signatureType: "EIP712_SIGN",
          },
        ]);

        provider.once(transaction, () => {
          dispatch({ type: "status", status: "listingSuccess" });

          resolve(true);
        });
      } catch (error) {
        dispatch({ type: "status", status: "listingError" });

        console.log("Error: Listing Request", error);
        reject(false);
      }
    });
  };

  const listNFT = async (listingValues: ListingValues) => {
    try {
      await requestingListingApproval();
      await listingToMarketPlace(listingValues);
    } catch (error) {
      dispatch({ type: "status", status: "listingError" });

      console.log("Error: Listing Flow", error);
    }
  };

  return {
    listNFT,
    state,
    dispatch,
  };
};
