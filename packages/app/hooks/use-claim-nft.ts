import { useReducer } from "react";

import { ethers } from "ethers";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { pollTransaction } from "./use-drop-nft";
import { useSignerAndProvider, useSignTypedData } from "./use-signer-provider";

const minterABI = ["function mintEdition(address collection, address _to)"];

const onePerAddressMinterContract =
  "0x50c001362FB06E2CB4D4e8138654267328a8B247";

type State = {
  status: "idle" | "loading" | "success" | "error";
  error?: string;
};

type Action = {
  error?: string;
  type: string;
};

const initialState: State = {
  status: "idle",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "success":
      return { ...state, status: "success" };
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

      const callData = targetInterface.encodeFunctionData("mintEdition", [
        props.editionAddress,
        userAddress,
      ]);

      const { data: forwardRequest } = await axios({
        url: `/v1/relayer/forward-request?call_data=${encodeURIComponent(
          callData
        )}&to_address=${encodeURIComponent(onePerAddressMinterContract)}`,
        method: "GET",
      });

      console.log("Signing...");
      const signature = await signTypedData(
        forwardRequest.domain,
        forwardRequest.types,
        forwardRequest.value
      );

      console.log("Signature", signature);
      console.log("Submitting tx...");
      const { data: relayedTx } = await axios({
        url: `/v1/relayer/forward-request`,
        method: "POST",
        data: {
          forward_request: forwardRequest,
          signature,
        },
      });

      const mint = await pollTransaction(
        relayedTx.relayed_transaction_id,
        "poll-mint"
      );

      if (mint) {
        dispatch({ type: "success" });
      } else {
        dispatch({ type: "error" });
      }
    } catch (e: any) {
      dispatch({ type: "error", error: e?.message });
      Logger.error("nft drop claim failed", e);
      captureException(e);
    }
  };

  return { state, claimNFT };
};
