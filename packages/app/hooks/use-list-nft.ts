import { useContext, useRef, useReducer, useState } from "react";

import { ethers } from "ethers";

import minterAbi from "app/abi/ShowtimeMT.json";
import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { AppContext } from "app/context/app-context";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy } from "app/utilities";

type ListNFT = {
  listingStatus: "idle" | "listing" | "listingError" | "listingSuccess";
  approvalStatus:
    | "idle"
    | "checkingApproval"
    | "requestingApproval"
    | "approvalError"
    | "approvalSuccess";
  transaction?: string;
};

type ListNFTAction = {
  type: ListNFT["listingStatus"] | ListNFT["approvalStatus"];
  transaction?: string;
};

const initialState: ListNFT = {
  listingStatus: "idle",
  approvalStatus: "idle",
  transaction: undefined,
};

const listNFTReducer = (state: ListNFT, action: ListNFTAction): ListNFT => {
  switch (action.type) {
    case "requestingApproval":
      return {
        ...state,
        approvalStatus: "requestingApproval",
        transaction: undefined,
      };
    case "approvalSuccess":
      return {
        ...state,
        approvalStatus: "approvalSuccess",
        transaction: action.transaction,
      };
    case "checkingApproval":
      return {
        ...state,
        approvalStatus: "checkingApproval",
      };
    case "approvalError":
      return { ...state, approvalStatus: "approvalError" };
    case "listing":
      return {
        ...state,
        listingStatus: "listing",
        transaction: undefined,
      };
    case "listingError":
      return { ...state, listingStatus: "listingError" };
    case "listingSuccess":
      return {
        ...state,
        listingStatus: "listingSuccess",
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
    try {
      dispatch({ type: "checkingApproval" });
      const { signer, provider } = await biconomy();
      const MARKET_PLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;

      const mintContract = new ethers.Contract(
        //@ts-ignore
        process.env.NEXT_PUBLIC_MINTING_CONTRACT,
        minterAbi,
        signer
      );

      const isApprovedForAll = await mintContract.isApprovedForAll(
        address,
        MARKET_PLACE_ADDRESS
      );

      console.log("isApprovedForAll", isApprovedForAll);
      if (isApprovedForAll) {
        // dispatch({ type: "approvalSuccess" });
        // console.log("approvalSuccess");
        const { data } =
          await mintContract.populateTransaction.setApprovalForAll(
            process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
            false
          );

        // TODO: Figure out how to handle unsigned request that don't error
        // Show did not see the sig req
        const transaction = await provider
          .send("eth_sendTransaction", [
            {
              data,
              from: address,
              to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
              signatureType: "EIP712_SIGN",
            },
          ])
          .catch((e) => console.log("hellop from e", e));
        console.log("transaction is set to false", transaction);
        provider.once(transaction, () => {
          dispatch({ type: "approvalSuccess" });
        });
      } else {
        dispatch({ type: "requestingApproval" });
        const { data } =
          await mintContract.populateTransaction.setApprovalForAll(
            process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
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

        console.log("transaction setting it to true", transaction);
      }
    } catch (error) {
      dispatch({ type: "approvalError" });
      console.log("requestingListingApproval nft error", error);
    }
  };

  const listNFT = async () => {
    try {
      console.log("requestingListingApproval", requestingListingApproval);
      // // connecting to providers and contracts
      // biconomyRef.current = await (await getBiconomy(connector, web3)).biconomy;
      // const signer = biconomyRef.current.getSignerByAddress(address);
      // const provider = biconomyRef.current.getEthersProvider();
      await requestingListingApproval();
      // const marketContract = new ethers.Contract(
      //   //@ts-ignore
      //   process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
      //   marketplaceAbi,
      //   signer
      // );
    } catch (error) {
      console.log("listing nft error", error);
    }
  };

  return {
    listNFT,
    state,
    dispatch,
  };

  //   const { data } = await mintContract.populateTransaction.setApprovalForAll(
  //     process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
  //     false
  //   );

  //   console.log("data", data);

  //   const transaction = await provider.send("eth_sendTransaction", [
  //     {
  //       data,
  //       from: address,
  //       to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
  //       signatureType: "EIP712_SIGN",
  //     },
  //   ]);

  //   console.log("transaction setting it to false", transaction);
  // }
};
