import { useReducer } from "react";

import { ethers } from "ethers";

import marketplaceAbi from "app/abi/ShowtimeV1Market.json";
import { useSignerAndProvider } from "app/hooks/use-signer-provider";
import { LIST_CURRENCIES } from "app/lib/constants";
import { NFT } from "app/types";
import { parseBalance } from "app/utilities";

type Status =
  | "idle"
  | "loading"
  | "waitingForTransaction"
  | "error"
  | "success";

type BuyNFTState = {
  status: Status;
  error?: string;
  transaction?: any;
};

type BuyNFTAction = {
  type: Status;
  payload?: { error?: string; transaction?: any };
};

const initialState: BuyNFTState = {
  status: "idle",
  error: undefined,
  transaction: null,
};

const buyNFTReducer = (
  state: BuyNFTState,
  action: BuyNFTAction
): BuyNFTState => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "error":
      return { ...state, status: "error", error: action.payload?.error };
    case "waitingForTransaction":
      return {
        ...state,
        status: "waitingForTransaction",
        transaction: action.payload?.transaction,
      };
    case "success":
      return { ...state, status: "success" };
    default:
      return state;
  }
};

export const useBuyNFT = () => {
  const [state, dispatch] = useReducer(buyNFTReducer, initialState);
  const { getSignerAndProvider } = useSignerAndProvider();

  const buyNFT = async (nft?: NFT) => {
    if (!nft || !nft.listing) return;

    dispatch({ type: "loading" });
    const result = await getSignerAndProvider();
    if (result) {
      const { signer, signerAddress, provider } = result;

      const contract = new ethers.Contract(
        //@ts-ignore
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        marketplaceAbi,
        signer
      );

      const basePrice = parseBalance(
        nft.listing.min_price.toString(),
        LIST_CURRENCIES[nft.listing.currency]
      );

      const { data } = await contract.populateTransaction.buy(
        nft.listing.sale_identifier,
        nft.token_id,
        1,
        basePrice,
        LIST_CURRENCIES[nft.listing.currency],
        signerAddress
      );

      const transaction = await provider
        .send("eth_sendTransaction", [
          {
            data,
            from: signerAddress,
            to: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
            signatureType: "EIP712_SIGN",
          },
        ])
        .catch((error: any) => {
          console.error("buy transaction failed ", error);
          dispatch({
            type: "error",
            payload: { error: "Something went wrong!" },
          });
        });

      if (transaction) {
        dispatch({ type: "waitingForTransaction", payload: { transaction } });
        provider.once(transaction, () => dispatch({ type: "success" }));
      }
    }
  };

  if (__DEV__) console.log("buy nft state ", state);

  return { buyNFT, state };
};
