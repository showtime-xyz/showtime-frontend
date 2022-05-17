import { useReducer } from "react";

import { ethers } from "ethers";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { delay } from "app/utilities";

import { useSignerAndProvider, useSignTypedData } from "./use-signer-provider";

const minterABI = ["function mintEdition(address collection, address _to)"];

const onePerAddressMinterContract =
  "0x50c001362FB06E2CB4D4e8138654267328a8B247";

type State = {
  status: "idle" | "loading" | "success" | "error";
  error?: string;
  transactionHash?: string;
  mint?: any;
};

type Action = {
  error?: string;
  type: string;
  transactionHash?: string;
  mint?: any;
};

const initialState: State = {
  status: "idle",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "success":
      return {
        ...state,
        status: "success",
        mint: action.mint,
      };
    case "transactionHash":
      return {
        ...state,
        transactionHash: action.transactionHash,
      };
    case "error":
      return { ...state, status: "error", error: action.error };
    default:
      return state;
  }
};

export const useClaimNFT = () => {
  const signTypedData = useSignTypedData();
  const { getUserAddress } = useSignerAndProvider();
  const [state, dispatch] = useReducer(reducer, initialState);

  const claimNFT = async (props: { editionAddress: string }) => {
    dispatch({ type: "loading" });
    try {
      const targetInterface = new ethers.utils.Interface(minterABI);
      const userAddress = await getUserAddress();
      if (userAddress) {
        const callData = targetInterface.encodeFunctionData("mintEdition", [
          props.editionAddress,
          userAddress,
        ]);

        const forwardRequest = await axios({
          url: `/v1/relayer/forward-request?call_data=${encodeURIComponent(
            callData
          )}&to_address=${encodeURIComponent(
            onePerAddressMinterContract
          )}&from_address=${encodeURIComponent(userAddress)}`,
          method: "GET",
        });

        Logger.log("Signing... ", forwardRequest);
        const signature = await signTypedData(
          forwardRequest.domain,
          forwardRequest.types,
          forwardRequest.value
        );

        Logger.log("Signature", signature);
        Logger.log("Submitting tx...");
        const relayedTx = await axios({
          url: `/v1/relayer/forward-request`,
          method: "POST",
          data: {
            forward_request: forwardRequest,
            signature,
            from_address: userAddress,
          },
        });

        let intervalMs = 2000;
        for (let attempts = 0; attempts < 100; attempts++) {
          Logger.log(`Checking tx... (${attempts + 1} / 20)`);
          const response = await axios({
            url: `/v1/creator-airdrops/poll-mint?relayed_transaction_id=${relayedTx.relayed_transaction_id}`,
            method: "GET",
          });
          Logger.log(response);

          dispatch({
            type: "transactionHash",
            transactionHash: response.transaction_hash,
          });

          if (response.is_complete) {
            dispatch({ type: "success", mint: response.mint });
            return;
          }

          await delay(intervalMs);
        }

        dispatch({ type: "error", error: "polling timed out" });
      }
    } catch (e: any) {
      dispatch({ type: "error", error: e?.message });
      Logger.error("nft drop claim failed", e);
      captureException(e);
    }
  };

  return { state, claimNFT };
};
