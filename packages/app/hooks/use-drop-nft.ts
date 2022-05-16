import { useReducer } from "react";

import { ethers } from "ethers";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { useSignTypedData } from "./use-signer-provider";
import { useUploadMedia } from "./use-upload-media";

const editionCreatorABI = [
  "function createEdition(string memory _name, string memory _symbol, string memory _description, string memory _animationUrl, bytes32 _animationHash, string memory _imageUrl, bytes32 _imageHash, uint256 _editionSize, uint256 _royaltyBPS, address minter) returns(uint256)",
];

const onePerAddressMinterContract =
  "0x50c001362FB06E2CB4D4e8138654267328a8B247";
const metaSingleEditionMintableCreator =
  "0x50c001c0aaa97B06De431432FDbF275e1F349694";

async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

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

export type UseDropNFT = {
  title: string;
  description: string;
  file: File | string;
  editionSize: number;
  royalty: number;
  symbol?: string;
  animationUrl?: string;
  animationHash?: string;
  imageHash?: string;
};

export const useDropNFT = () => {
  const signTypedData = useSignTypedData();
  const uploadMedia = useUploadMedia();
  const [state, dispatch] = useReducer(reducer, initialState);

  const dropNFT = async (params: UseDropNFT) => {
    try {
      const targetInterface = new ethers.utils.Interface(editionCreatorABI);

      dispatch({ type: "loading" });
      const ipfsHash = await uploadMedia(params.file);
      console.log("ipfs hash ", ipfsHash, params);

      const callData = targetInterface.encodeFunctionData("createEdition", [
        params.title,
        "SHOWTIME",
        params.description,
        "", // animationUrl
        "0x0000000000000000000000000000000000000000000000000000000000000000", // animationHash
        "ipfs://" + ipfsHash, // imageUrl
        "0x0000000000000000000000000000000000000000000000000000000000000000", // imageHash
        params.editionSize, // editionSize
        params.royalty * 100, // royaltyBPS
        onePerAddressMinterContract,
      ]);

      const forwardRequest = await axios({
        url: `/v1/relayer/forward-request?call_data=${encodeURIComponent(
          callData
        )}&to_address=${encodeURIComponent(metaSingleEditionMintableCreator)}`,
        method: "GET",
      });

      console.log("Signing... ", forwardRequest);
      const signature = await signTypedData(
        forwardRequest.domain,
        forwardRequest.types,
        forwardRequest.value
      );

      console.log("Signature", signature);
      console.log("Submitting tx...");
      const relayerResponse = await axios({
        url: `/v1/relayer/forward-request`,
        method: "POST",
        data: {
          forward_request: forwardRequest,
          signature,
        },
      });

      const edition = await pollTransaction(
        relayerResponse.relayed_transaction_id,
        "poll-edition"
      );

      if (edition) {
        dispatch({ type: "success" });
      } else {
        dispatch({ type: "error" });
      }
    } catch (e: any) {
      dispatch({ type: "error", error: e?.message });
      Logger.error("nft drop failed", e);
      captureException(e);
    }
  };

  return { dropNFT, state };
};

export const pollTransaction = async (
  relayedTransactionId: string,
  pollEndpointName: string
) => {
  let intervalMs = 1000;
  for (let attempts = 0; attempts < 20; attempts++) {
    console.log(`Checking tx... (${attempts + 1} / 20)`);
    const { data: response } = await axios({
      url: `/v1/creator-airdrops/${pollEndpointName}?relayed_transaction_id=${relayedTransactionId}`,
      method: "GET",
    });
    console.log(response);
    if (response.is_complete) {
      return response;
    }
    await delay(intervalMs);
  }
};
