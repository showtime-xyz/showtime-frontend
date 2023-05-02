import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useOnboardingPromise } from "app/components/onboarding";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useLogInPromise } from "app/lib/login-promise";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { formatAPIErrorMessage } from "app/utilities";

import { toast } from "design-system/toast";

import { IEdition } from "../types";
import { useConnectAppleMusic } from "./use-connect-apple-music";
import { useSaveAppleMusicToken } from "./use-save-apple-music-token";
import { useStableCallback } from "./use-stable-callback";
import { useUser } from "./use-user";

export const useAppleMusicGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const Alert = useAlert();
  const { claimNFT } = useClaimNFT(edition);
  const { connectAppleMusic } = useConnectAppleMusic();
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();
  const { saveAppleMusicToken } = useSaveAppleMusicToken();

  const fetcher = useStableCallback(async function claimAppleMusicGatedDrop(
    _key: string,
    values: { arg: { closeModal?: any } }
  ) {
    const closeModal = values?.arg?.closeModal;
    try {
      if (user.isAuthenticated) {
        let appleMusicConnected =
          user?.user?.data.profile.has_apple_music_token;
        if (!appleMusicConnected) {
          appleMusicConnected = !!(await connectAppleMusic());
        }
        if (appleMusicConnected) {
          const res = await claimNFT({ closeModal });
          return res;
        }
      } else {
        let appleMusicToken;
        try {
          appleMusicToken = await connectAppleMusic();
        } catch (error: any) {
          if (error?.response?.status === 400) {
            loginPromise();
            return;
          }
        }
        if (appleMusicToken) {
          await axios({
            url: "/v1/apple_music/gate",
            data: {
              token: appleMusicToken,
              edition_address: edition.contract_address,
            },
            method: "POST",
          });
          Analytics.track(EVENTS.APPLE_MUSIC_SAVE_SUCCESS_BEFORE_LOGIN);

          toast.success(
            "You just saved this song to your library! Sign in now to collect this drop.",
            { duration: 5000 }
          );
          await loginPromise();
          await onboardingPromise();

          await saveAppleMusicToken({
            token: appleMusicToken,
          });
          await claimNFT({ closeModal });
        }
      }
    } catch (error: any) {
      Logger.error("claimAppleMusicGatedDrop failed", error);
      Alert.alert("Something went wrong", formatAPIErrorMessage(error));
      throw error;
    }
  });

  const state = useSWRMutation(MY_INFO_ENDPOINT, fetcher);

  return { ...state, claimAppleMusicGatedDrop: state.trigger };
};
