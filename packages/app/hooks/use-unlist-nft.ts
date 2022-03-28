import { useRef, useReducer } from "react";

import { ethers } from "ethers";

import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy, parseBalance } from "app/utilities";

export type UnlistNFT = {
  status: "idle" | "unlisting" | "unlistingError" | "unlistingSuccess";
};

type UnlistNFTAction = {
  type: "status";
  status: UnlistNFT["status"];
};

// Maps to market place smart contract listingId
export type UnlistingValue = number | undefined;

const initialState: UnlistNFT = {
  status: "idle",
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

  const unlistingFromMarketPlace = async (listingId: UnlistingValue) => {
    return await new Promise(async (resolve, reject) => {
      try {
        const missingListingId = !listingId;

        if (missingListingId) {
          dispatch({ type: "status", status: "unlistingError" });
          throw "Attempting to unlist without a listingID";
        }

        dispatch({ type: "status", status: "unlisting" });

        const { signer, provider } = await biconomy();

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
            from: address,
            to: MARKET_PLACE_ADDRESS,
            signatureType: "EIP712_SIGN",
          },
        ]);

        console.log("Unlisting Transaction", transaction);

        provider.once(transaction, () => {
          dispatch({ type: "status", status: "unlistingSuccess" });
          resolve(true);
        });
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

  return {
    unlistNFT,
    state,
    dispatch,
  };
};
