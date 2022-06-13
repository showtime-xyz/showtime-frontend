import { useReducer } from "react";

import { ethers } from "ethers";

import { useAlert } from "@showtime-xyz/universal.alert";

import { PROFILE_NFTS_QUERY_KEY } from "app/hooks/api-hooks";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useSignTypedData } from "app/hooks/use-sign-typed-data";
import { useUploadMedia } from "app/hooks/use-upload-media";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { delay } from "app/utilities";

const editionCreatorABI = [
  "function createEdition(string memory _name, string memory _symbol, string memory _description, string memory _animationUrl, bytes32 _animationHash, string memory _imageUrl, bytes32 _imageHash, uint256 _editionSize, uint256 _royaltyBPS, uint256 claimWindowDurationSeconds) returns(address, address)",
];

const metaSingleEditionMintableCreator =
  process.env.NEXT_PUBLIC_META_SINGLE_EDITION_MINTABLE_CREATOR;

type IEdition = {
  contract_address: string;
  description: string;
  edition_size: string;
  image_url: string;
  name: string;
  owner_address: string;
  symbol: string;
};

type State = {
  status: "idle" | "loading" | "success" | "error";
  transactionHash?: string;
  edition?: IEdition;
  transactionId?: any;
  error?: string;
};

type Action = {
  error?: string;
  type: string;
  transactionHash?: string;
  edition?: IEdition;
  transactionId?: any;
};

const initialState: State = {
  status: "idle",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "success":
      return { ...state, status: "success", edition: action.edition };
    case "error":
      return { ...state, status: "error", error: action.error };
    case "transactionHash":
      return {
        ...state,
        transactionHash: action.transactionHash,
        transactionId: action.transactionId,
      };
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
  duration: number;
  symbol?: string;
  animationUrl?: string;
  animationHash?: string;
  imageHash?: string;
};

export const useDropNFT = () => {
  const signTypedData = useSignTypedData();
  const uploadMedia = useUploadMedia();
  const { userAddress } = useCurrentUserAddress();
  const [state, dispatch] = useReducer(reducer, initialState);
  const mutate = useMatchMutate();
  const Alert = useAlert();

  const dropNFT = async (params: UseDropNFT) => {
    try {
      if (userAddress) {
        const targetInterface = new ethers.utils.Interface(editionCreatorABI);

        dispatch({ type: "loading" });

        const ipfsHash = await uploadMedia(params.file);
        Logger.log("ipfs hash ", ipfsHash, params);
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
          params.duration,
        ]);

        // Sending params to backend to get the signature request
        const forwardRequest = await axios({
          url: `/v1/relayer/forward-request?call_data=${encodeURIComponent(
            callData
          )}&to_address=${encodeURIComponent(
            metaSingleEditionMintableCreator
          )}&from_address=${userAddress}`,
          method: "GET",
        });

        Logger.log("Signing... ", forwardRequest);
        const signature = await signTypedData(
          forwardRequest.domain,
          forwardRequest.types,
          forwardRequest.value,
          (error) => {
            dispatch({ type: "error", error });
          }
        );

        Logger.log("Signature", signature);
        Logger.log("Submitting tx...");
        // Sending signature to backend to initiate the transaction
        const relayerResponse = await axios({
          url: `/v1/relayer/forward-request`,
          method: "POST",
          data: {
            forward_request: forwardRequest,
            signature,
            from_address: userAddress,
          },
        });

        await pollTransaction(relayerResponse.relayed_transaction_id);
      } else {
        Alert.alert(
          "Wallet seems to be disconnected. Try signing out and signing in."
        );
      }
    } catch (e: any) {
      dispatch({ type: "error", error: e?.message });
      Logger.error("nft drop failed", e);
      captureException(e);
    }
  };

  const pollTransaction = async (transactionId: string) => {
    // Polling to check transaction status
    let intervalMs = 2000;
    for (let attempts = 0; attempts < 100; attempts++) {
      Logger.log(`Checking tx... (${attempts + 1} / 100)`);
      const response = await axios({
        url: `/v1/creator-airdrops/poll-edition?relayed_transaction_id=${transactionId}`,
        method: "GET",
      });
      Logger.log(response);

      dispatch({
        type: "transactionHash",
        transactionHash: response.transaction_hash,
        transactionId,
      });

      if (response.is_complete) {
        dispatch({ type: "success", edition: response.edition });
        mutate((key) => key.includes(PROFILE_NFTS_QUERY_KEY));
        return;
      }

      await delay(intervalMs);
    }

    dispatch({ type: "error", error: "polling timed out" });
  };

  return { dropNFT, state, pollTransaction };
};
