import { useReducer, useState, useCallback } from "react";

import type {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";

import { useAlert } from "@showtime-xyz/universal.alert";

import { PROFILE_NFTS_QUERY_KEY } from "app/hooks/api-hooks";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useSignTypedData } from "app/hooks/use-sign-typed-data";
import { useUploadMediaToPinata } from "app/hooks/use-upload-media-to-pinata";
import { useWallet } from "app/hooks/use-wallet";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useRudder } from "app/lib/rudderstack";
import { captureException } from "app/lib/sentry";
import {
  delay,
  getFileMeta,
  isMobileWeb,
  ledgerWalletHack,
} from "app/utilities";

const editionCreatorABI = [
  "function createEdition(string memory _name, string memory _symbol, string memory _description, string memory _animationUrl, bytes32 _animationHash, string memory _imageUrl, bytes32 _imageHash, uint256 _editionSize, uint256 _royaltyBPS, uint256 claimWindowDurationSeconds) returns(address, address)",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

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
  signaturePrompt?: boolean;
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
  signaturePrompt: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "success":
      return { ...state, status: "success", edition: action.edition };
    case "error":
      return {
        ...state,
        status: "error",
        error: action.error,
        signaturePrompt: false,
      };
    case "reset": {
      return initialState;
    }
    case "transactionHash":
      return {
        ...state,
        transactionHash: action.transactionHash,
        transactionId: action.transactionId,
      };
    case "signaturePrompt": {
      return {
        ...state,
        signaturePrompt: true,
      };
    }
    case "signatureSuccess": {
      return {
        ...state,
        signaturePrompt: false,
      };
    }
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
  notSafeForWork: boolean;
  symbol?: string;
  animationUrl?: string;
  animationHash?: string;
  imageHash?: string;
};

export const useDropNFT = () => {
  const { rudder } = useRudder();
  const signTypedData = useSignTypedData();
  const uploadMedia = useUploadMediaToPinata();
  const { userAddress } = useCurrentUserAddress();
  const { connect } = useWallet();
  const [state, dispatch] = useReducer(reducer, initialState);
  const mutate = useMatchMutate();
  const Alert = useAlert();
  const [signMessageData, setSignMessageData] = useState({
    status: "idle",
    data: null as any,
  });
  const shouldShowSignMessage =
    signMessageData.status === "should_sign" && isMobileWeb();

  const pollTransaction = async ({
    transactionId,
    notSafeForWork,
  }: {
    transactionId: string;
    notSafeForWork: boolean;
  }) => {
    // Polling to check transaction status
    let intervalMs = 2000;
    for (let attempts = 0; attempts < 100; attempts++) {
      Logger.log(`Checking tx... (${attempts + 1} / 100)`);
      const response = await axios({
        url: `/v1/creator-airdrops/poll-edition?relayed_transaction_id=${transactionId}${
          notSafeForWork ? "&nsfw=true" : ""
        }`,
        method: "GET",
      });
      Logger.log(response);

      dispatch({
        type: "transactionHash",
        transactionHash: response.transaction_hash,
        transactionId,
      });

      if (response.is_complete) {
        rudder?.track("Drop Created");
        dispatch({ type: "success", edition: response.edition });
        mutate((key) => key.includes(PROFILE_NFTS_QUERY_KEY));
        return;
      }

      await delay(intervalMs);
    }

    dispatch({ type: "error", error: "polling timed out" });
  };

  // @ts-ignore
  const signTransaction = async ({
    forwardRequest,
    notSafeForWork,
  }: {
    forwardRequest: {
      domain: TypedDataDomain;
      types: Record<string, Array<TypedDataField>>;
      value: Record<string, string | number>;
    };
    notSafeForWork: boolean;
  }) => {
    if (isMobileWeb()) {
      setSignMessageData({
        status: "sign_requested",
        data: { forwardRequest, notSafeForWork },
      });
    }

    dispatch({ type: "signaturePrompt" });
    const signature = await signTypedData(
      forwardRequest.domain,
      forwardRequest.types,
      forwardRequest.value
    );

    dispatch({ type: "signatureSuccess" });

    const newSignature = ledgerWalletHack(signature);
    Logger.log("Signature", { signature, newSignature });
    Logger.log("Submitting tx...");

    // Sending signature to backend to initiate the transaction
    const relayerResponse = await axios({
      url: `/v1/relayer/forward-request`,
      method: "POST",
      data: {
        forward_request: forwardRequest,
        signature: newSignature,
        from_address: userAddress,
      },
    });

    await pollTransaction({
      transactionId: relayerResponse.relayed_transaction_id,
      notSafeForWork,
    });
  };

  const dropNFT = async (params: UseDropNFT) => {
    try {
      if (userAddress) {
        const Interface = (await import("@ethersproject/abi")).Interface;
        const targetInterface = new Interface(editionCreatorABI);

        const fileMetaData = await getFileMeta(params.file);

        if (
          fileMetaData &&
          typeof fileMetaData.size === "number" &&
          fileMetaData.size > MAX_FILE_SIZE
        ) {
          Alert.alert(
            `This file is too big. Please use a file smaller than 50 MB.`
          );
          return;
        }

        dispatch({ type: "loading" });

        const ipfsHash = await uploadMedia({
          file: params.file,
          notSafeForWork: params.notSafeForWork,
        });

        const escapedTitle = JSON.stringify(params.title).slice(1, -1);
        const escapedDescription = JSON.stringify(params.description).slice(
          1,
          -1
        );

        Logger.log("ipfs hash ", {
          ipfsHash,
          params,
          escapedTitle,
          escapedDescription,
        });

        const callData = targetInterface.encodeFunctionData("createEdition", [
          escapedTitle,
          "SHOWTIME",
          escapedDescription,
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
            //@ts-ignore
            metaSingleEditionMintableCreator
          )}&from_address=${userAddress}`,
          method: "GET",
        });

        Logger.log("Signing... ", forwardRequest);

        if (isMobileWeb()) {
          setSignMessageData({
            status: "should_sign",
            data: { forwardRequest, notSafeForWork: params.notSafeForWork },
          });
        } else {
          await signTransaction({
            forwardRequest,
            notSafeForWork: params.notSafeForWork,
          });
        }
      } else {
        // user is probably not connected to wallet
        connect();
      }
    } catch (e: any) {
      dispatch({ type: "error", error: e?.message });
      Logger.error("nft drop failed", e);

      if (e?.response?.status === 420) {
        Alert.alert(
          "Wow, you love drops!",
          "Only one drop per day is allowed. Come back tomorrow!"
        );
      }

      if (e?.response?.status === 500) {
        Alert.alert(
          "Oops. An error occured.",
          "We are currently experiencing a lot of usage. Please try again in one hour!"
        );
      }

      captureException(e);
    }
  };

  const onReconnectWallet = useCallback(() => {
    dispatch({
      type: "error",
      error: "Please retry creating a drop",
    });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return {
    dropNFT,
    state,
    pollTransaction,
    shouldShowSignMessage,
    signMessageData,
    signTransaction,
    onReconnectWallet,
    reset,
  };
};
