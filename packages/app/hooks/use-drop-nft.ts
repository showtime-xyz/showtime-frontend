import { useCallback, useContext } from "react";

import { Alert } from "@showtime-xyz/universal.alert";

import { PROFILE_NFTS_QUERY_KEY } from "app/hooks/api-hooks";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useUploadMediaToPinata } from "app/hooks/use-upload-media-to-pinata";
import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { GatingType } from "app/types";
import { delay, formatAPIErrorMessage, getFileMeta } from "app/utilities";

import { toast } from "design-system/toast";

import { DropContext } from "../context/drop-context";
import { useSendFeedback } from "./use-send-feedback";

export const MAX_FILE_SIZE = 30 * 1024 * 1024; // in bytes

type IEdition = {
  contract_address: string;
  description: string;
  edition_size: string;
  image_url: string;
  name: string;
  owner_address: string;
  symbol: string;
};

export type State = {
  status: "idle" | "loading" | "success" | "error";
  transactionHash?: string;
  edition?: IEdition;
  transactionId?: any;
  error?: string;
  signaturePrompt?: boolean;
};

export type Action = {
  error?: string;
  type: string;
  transactionHash?: string;
  edition?: IEdition;
  transactionId?: any;
};

export const initialState: State = {
  status: "idle",
  signaturePrompt: false,
};

type DropRequestData = {
  name: string;
  description: string;
  image_url: string;
  edition_size: number;
  royalty_bps: number;
  claim_window_duration_seconds: number;
  nsfw: boolean;
  spotify_url?: string;
  apple_music_url?: string;
  gating_type?: GatingType;
  release_date?: string;
  password?: string;
  location_gating?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    google_maps_url?: string;
  };
  multi_gating_types?: ["password", "location"];
  raffle?: boolean;
};

export const reducer = (state: State, action: Action): State => {
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
  appleMusicTrackUrl?: string;
  gatingType?: GatingType;
  password?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  releaseDate?: string;
  raffle?: boolean;
};

export const useDropNFT = () => {
  const uploadMedia = useUploadMediaToPinata();
  const { state, dispatch } = useContext(DropContext);
  const mutate = useMatchMutate();
  const { onSendFeedback } = useSendFeedback();
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
        Analytics.track(EVENTS.DROP_CREATED);
        mutate((key) => key.includes(PROFILE_NFTS_QUERY_KEY));
        return;
      }

      await delay(intervalMs);
    }

    dispatch({ type: "error", error: "polling timed out" });
  };

  const dropNFT = async (params: UseDropNFT, callback?: () => void) => {
    if (state.status === "loading") return;

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
      toast("Creating... it should take about 10 seconds");
      dispatch({ type: "loading" });

      const ipfsHash = await uploadMedia({
        file: params.file,
      });

      if (!ipfsHash) {
        dispatch({
          type: "error",
          error: "Failed to upload the media onto IPFS. Please try again!",
        });
        return;
      }

      Logger.log("ipfs hash ", {
        ipfsHash,
        params,
        title: params.title,
        description: params.description,
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

      const locationGating = params.googleMapsUrl
        ? {
            location_gating: {
              latitude: params.latitude,
              longitude: params.longitude,
              radius: params.radius,
              google_maps_url: params.googleMapsUrl,
            },
          }
        : {};

      let requestData: DropRequestData = {
        name: params.title,
        raffle: params?.raffle,
        description: params.description,
        image_url: "ipfs://" + ipfsHash,
        edition_size: params.editionSize,
        royalty_bps: params.royalty * 100,
        claim_window_duration_seconds: params.duration,
        nsfw: params.notSafeForWork,
        spotify_url: params.spotifyUrl,
        apple_music_url: params.appleMusicTrackUrl,
        gating_type: gatingType,
        password: params.password !== "" ? params.password : undefined,
        ...locationGating,
        multi_gating_types:
          isPasswordGated && isLocationGated
            ? ["password", "location"]
            : undefined,
      };

      // TODO: deprecate spotify_presave at some point
      if (params.releaseDate && params.gatingType === "spotify_presave") {
        requestData.release_date = params.releaseDate;
      }

      if (
        params.releaseDate &&
        params.gatingType === "multi_provider_music_presave"
      ) {
        requestData.release_date = params.releaseDate;
      }

      const relayerResponse = await axios({
        url: "/v1/creator-airdrops/create-gated-edition",
        method: "POST",
        data: requestData,
      });

      console.log("relayer response :: ", relayerResponse);
      await pollTransaction({
        transactionId: relayerResponse.relayed_transaction_id,
      });
      callback?.();
    } catch (e: any) {
      const errorMessage = formatAPIErrorMessage(e);
      dispatch({ type: "error", error: errorMessage });
      Logger.error("nft drop failed", e);

      if (e?.response?.status === 420) {
        Alert.alert(
          "Wow, you love drops!",
          "Only one drop per day is allowed. Come back tomorrow!"
        );
      } else {
        Alert.alert(
          "An error occurred.",
          errorMessage +
            ". Please contact us at help@showtime.xyz if this persists. Thanks!",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Contact",
              onPress: onSendFeedback,
            },
          ]
        );
      }

      captureException(e);
    }
  };

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, [dispatch]);

  return {
    dropNFT,
    state,
    pollTransaction,
    reset,
  };
};
