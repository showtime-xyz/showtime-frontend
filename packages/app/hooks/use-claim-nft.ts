import { useContext, useCallback } from "react";
import { Platform } from "react-native";

import type { LocationObject } from "expo-location";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useRouter } from "@showtime-xyz/universal.router";

import { ClaimContext } from "app/context/claim-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { IEdition } from "app/types";
import {
  formatAPIErrorMessage,
  getFormatDistanceToNowStrict,
} from "app/utilities";

import { toast } from "design-system/toast";

import { useSendFeedback } from "./use-send-feedback";

export type State = {
  status: "idle" | "loading" | "success" | "share" | "error" | "initial";
  error?: string;
  transactionHash?: string;
  mint?: any;
  signaturePrompt?: boolean;
};

export type Action = {
  error?: string;
  type: string;
  transactionHash?: string;
  mint?: any;
};

export const initialState: State = {
  status: "idle",
  signaturePrompt: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };
    case "success":
      return {
        ...state,
        status: "success",
        transactionHash: undefined,
        mint: action.mint,
      };
    case "transactionHash":
      return {
        ...state,
        transactionHash: action.transactionHash,
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
        transactionHash: undefined,
      };
    }
    case "share":
      return {
        ...state,
        status: "share",
        transactionHash: undefined,
      };
    case "error":
      return {
        ...state,
        status: "error",
        signaturePrompt: false,
        transactionHash: undefined,
        error: action.error,
      };
    case "initial":
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const useClaimNFT = (edition: IEdition) => {
  const router = useRouter();
  const { data: userProfile } = useMyInfo();
  const { state, dispatch, pollTransaction } = useContext(ClaimContext);
  const Alert = useAlert();
  const { onSendFeedback } = useSendFeedback();

  type ClaimNFTParams = {
    password?: string;
    location?: LocationObject;
    closeModal?: () => void;
  };
  const claimNFT = async ({
    password,
    location,
    closeModal,
  }: ClaimNFTParams): Promise<boolean | undefined> => {
    try {
      if (edition?.minter_address) {
        dispatch({ type: "loading" });
        if (edition?.is_gated) {
          await gatedClaimFlow({ password, location, closeModal });
        } else {
          closeModal?.();
        }
        return true;
      }
    } catch (e: any) {
      const errorMessage = formatAPIErrorMessage(e);
      dispatch({ type: "error", error: errorMessage });
      Logger.error("nft drop claim failed", e);

      if (e?.response?.status === 420) {
        // Verified users have claim limit to 10 and users that have phone verified also have claim limit to 10.
        // So increasing claim limit alert makes sense only when you're not verified and you've not verified your phone
        if (
          !userProfile?.data.profile.has_verified_phone_number &&
          !userProfile?.data.profile.verified
        ) {
          Alert.alert(
            "Wow, you love collecting drops!",
            "Prove you're a real person and we'll let you collect more. Please verify your phone number.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Verify my phone number",
                onPress: () => {
                  Analytics.track(EVENTS.BUTTON_CLICKED, {
                    name: "Verify my phone number",
                  });

                  router.push(
                    Platform.select({
                      native: `/settings/verify-phone-number`,
                      web: {
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          verifyPhoneNumberModal: true,
                        },
                      } as any,
                    }),
                    Platform.select({
                      native: `/settings/verify-phone-number`,
                      web: router.asPath,
                    }),
                    { scroll: false }
                  );
                },
              },
            ]
          );
        } else {
          Alert.alert(
            "Wow, you love collecting drops!",
            `Only ${
              userProfile?.data.daily_claim_limit
            } claims per day is allowed. Come back ${getFormatDistanceToNowStrict(
              userProfile?.data.claim_tank.next_refill_at
            )}!`
          );
        }
      } else if (e?.response?.status === 440) {
        Alert.alert("Wrong password or wrong location", "Please try again!");
      } else {
        Alert.alert(
          "Oops. An error occurred.",
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
  const gatedClaimFlow = async ({
    password,
    location,
    closeModal,
  }: ClaimNFTParams) => {
    if (edition?.minter_address) {
      await axios({
        url: `/v1/creator-airdrops/edition/${edition.contract_address}/claim`,
        method: "POST",
        data: {
          password: password !== "" ? password : undefined,
          location: location?.coords
            ? {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
              }
            : undefined,
        },
      })
        .catch((error) => {
          Alert.alert("Oops. An error occurred.", error.message);
        })
        .then(() => {
          toast.success("Collected!");
          closeModal?.();
        });
    }
  };

  const onReconnectWallet = useCallback(() => {
    dispatch({
      type: "error",
      error: "Collecting failed. Please try again!",
    });
  }, [dispatch]);

  return {
    state,
    claimNFT,
    onReconnectWallet,
  };
};
