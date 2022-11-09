import { useReducer, useCallback } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";

import { PROFILE_NFTS_QUERY_KEY } from "app/hooks/api-hooks";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useUploadMediaToPinata } from "app/hooks/use-upload-media-to-pinata";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { delay, getFileMeta } from "app/utilities";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

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
  spotifyUrl?: string;
  gatingType?: string;
  password?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
};

export const useDropNFT = () => {
  const uploadMedia = useUploadMediaToPinata();
  const [state, dispatch] = useReducer(reducer, initialState);
  const mutate = useMatchMutate();
  const Alert = useAlert();

  const pollTransaction = async ({
    transactionId,
  }: {
    transactionId: string;
  }) => {
    // Polling to check transaction status
    let intervalMs = 2000;
    for (let attempts = 0; attempts < 100; attempts++) {
      Logger.log(`Checking tx... (${attempts + 1} / 100)`);
      const response = await axios({
        url: `/v1/creator-airdrops/poll-edition?relayed_transaction_id=${transactionId}&is_gated_edition=true`,
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

  const dropNFT = async (params: UseDropNFT) => {
    try {
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

      if (!ipfsHash) {
        dispatch({
          type: "error",
          error: "Failed to upload the media on IPFS. Please try again!",
        });
        return;
      }

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

      const isPasswordGated = params.password;
      const isLocationGated =
        params.radius &&
        ((params.latitude && params.longitude) || params.googleMapsUrl);

      const gatingType = params.gatingType
        ? params.gatingType
        : isPasswordGated && isLocationGated
        ? "multi"
        : isPasswordGated
        ? "password"
        : isLocationGated
        ? "location"
        : undefined;

      const relayerResponse = await axios({
        url: "/v1/creator-airdrops/create-gated-edition",
        method: "POST",
        data: {
          name: escapedTitle,
          description: escapedDescription,
          image_url: "ipfs://" + ipfsHash,
          edition_size: params.editionSize,
          royalty_bps: params.royalty * 100,
          claim_window_duration_seconds: params.duration,
          nsfw: params.notSafeForWork,
          spotify_url: params.spotifyUrl,
          gating_type: gatingType,
          password: params.password !== "" ? params.password : undefined,
          location_gating: {
            latitude: params.latitude,
            longitude: params.longitude,
            radius: params.radius,
            google_maps_url: params.googleMapsUrl,
          },
          multi_gating_types:
            isPasswordGated && isLocationGated
              ? ["password", "location"]
              : undefined,
        },
      });

      console.log("relayer response :: ", relayerResponse);
      await pollTransaction({
        transactionId: relayerResponse.relayed_transaction_id,
      });
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
      error: "Please try again...",
    });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return {
    dropNFT,
    state,
    pollTransaction,
    onReconnectWallet,
    reset,
  };
};
