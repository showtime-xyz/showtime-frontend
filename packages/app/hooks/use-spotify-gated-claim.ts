import { useOnboardingPromise } from "app/components/onboarding";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useLogInPromise } from "app/lib/login-promise";

import { toast } from "design-system/toast";

import { IEdition } from "../types";
import { useConnectSpotify } from "./use-connect-spotify";
import { useSaveSpotifyToken } from "./use-save-spotify-token";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);
  const { connectSpotify } = useConnectSpotify();
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();
  const { saveSpotifyToken } = useSaveSpotifyToken();

  const claimSpotifyGatedDrop = async (closeModal?: () => void) => {
    if (user.isAuthenticated) {
      try {
        let spotifyConnected = user?.user?.data.profile.has_spotify_token;
        if (!spotifyConnected) {
          spotifyConnected = !!(await connectSpotify());
        }
        if (spotifyConnected) {
          const res = claimNFT({ closeModal });
          return res;
        }
      } catch (error: any) {
        Logger.error("claimSpotifyGatedDrop failed", error);
      }
    } else {
      try {
        let spotifyToken = await connectSpotify();

        if (spotifyToken) {
          await axios({
            url: "/v1/spotify/gate",
            data: {
              code: spotifyToken.code,
              redirect_uri: spotifyToken.redirectUri,
              edition_address: edition.contract_address,
            },
            method: "POST",
          });
          Analytics.track(EVENTS.SPOTIFY_SAVE_SUCCESS_BEFORE_LOGIN);

          toast.success(
            "You just saved this song to your library! Sign in now to collect this drop."
          );
          await loginPromise();
          await onboardingPromise();

          await saveSpotifyToken({
            code: spotifyToken.code,
            redirectUri: spotifyToken.redirectUri,
          });
          await claimNFT({ closeModal });
        }
      } catch (error: any) {
        Logger.error("claimSpotifyGatedDrop failed", error);
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
