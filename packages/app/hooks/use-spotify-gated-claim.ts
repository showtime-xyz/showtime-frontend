import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useOnboardingPromise } from "app/components/onboarding";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useLogInPromise } from "app/lib/login-promise";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { toast } from "design-system/toast";

import { IEdition } from "../types";
import { useConnectSpotify } from "./use-connect-spotify";
import { useSaveSpotifyToken } from "./use-save-spotify-token";
import { useStableCallback } from "./use-stable-callback";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition: IEdition | null | undefined) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);
  const Alert = useAlert();
  const { connectSpotify } = useConnectSpotify();
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();
  const { saveSpotifyToken } = useSaveSpotifyToken();

  const claimSpotifyGatedDrop = useStableCallback(
    async (closeModal?: () => void) => {
      try {
        if (user.isAuthenticated) {
          let spotifyConnected = user?.user?.data.profile.has_spotify_token;
          if (!spotifyConnected) {
            spotifyConnected = !!(await connectSpotify());
          }
          if (spotifyConnected) {
            const res = claimNFT({ closeModal });
            return res;
          }
        } else {
          let spotifyToken = await connectSpotify();

          if (spotifyToken) {
            await axios({
              url: "/v1/spotify/gate",
              data: {
                code: spotifyToken.code,
                redirect_uri: spotifyToken.redirectUri,
                edition_address: edition?.contract_address,
              },
              method: "POST",
            });
            Analytics.track(EVENTS.SPOTIFY_SAVE_SUCCESS_BEFORE_LOGIN);

            toast.success(
              "You just saved this song to your library! Sign in now to collect this drop.",
              { duration: 5000 }
            );
            await loginPromise();
            await onboardingPromise();

            await saveSpotifyToken({
              code: spotifyToken.code,
              redirectUri: spotifyToken.redirectUri,
            });
            await claimNFT({ closeModal });
          }
        }
      } catch (error: any) {
        Logger.error("claimSpotifyGatedDrop failed", error);
        Alert.alert("Something went wrong", error.response?.data.error.message);
      }
    }
  );

  const state = useSWRMutation(
    MY_INFO_ENDPOINT,
    async function fetcher(
      _key: string,
      values: { arg: { closeModal?: any } }
    ) {
      return claimSpotifyGatedDrop(values?.arg?.closeModal);
    }
  );

  return { claimSpotifyGatedDrop: state.trigger, ...state };
};
