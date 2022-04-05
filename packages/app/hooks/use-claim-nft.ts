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

type ClaimNFTState = {
  status: Status;
  error?: string;
  transaction?: any;
};

type ClaimNFTAction = {
  type: Status;
  payload?: { error?: string; transaction?: any };
};

const initialState: ClaimNFTState = {
  status: "idle",
  error: undefined,
  transaction: null,
};

const claimNFTReducer = (
  state: ClaimNFTState,
  action: ClaimNFTAction
): ClaimNFTState => {
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

export const useClaimNFT = () => {
  const [state, dispatch] = useReducer(claimNFTReducer, initialState);
  const { getSignerAndProvider } = useSignerAndProvider();

  const claimNFT = async (nft?: NFT) => {
    if (!nft || !nft.listing) return;

    dispatch({ type: "loading" });
    const providerAndSigner = await getSignerAndProvider();
    if (providerAndSigner) {
      const { signer, signerAddress, provider } = providerAndSigner;

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
          console.error("claim transaction failed ", error);
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

  if (__DEV__) console.log("claim nft state ", state);

  return { claimNFT, state };
};
