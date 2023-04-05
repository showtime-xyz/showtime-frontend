import { useOnboardingPromise } from "app/components/onboarding";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useLogInPromise } from "app/lib/login-promise";

import { toast } from "design-system/toast";

import { IEdition } from "../types";
import { useConnectAppleMusic } from "./use-connect-apple-music";
import { useSaveAppleMusicToken } from "./use-save-apple-music-token";
import { useUser } from "./use-user";

export const useAppleMusicGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);
  const { connectAppleMusic } = useConnectAppleMusic();
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();
  const { saveAppleMusicToken } = useSaveAppleMusicToken();

  const claimAppleMusicGatedDrop = async (closeModal?: () => void) => {
    if (user.isAuthenticated) {
      try {
        let appleMusicConnected = user?.user?.data.profile.has_apple_music;
        if (!appleMusicConnected) {
          appleMusicConnected = !!(await connectAppleMusic());
        }
        if (appleMusicConnected) {
          const res = claimNFT({ closeModal });
          return res;
        }
      } catch (error: any) {
        Logger.error("claimAppleMusicGatedDrop failed", error);
      }
    } else {
      try {
        let appleMusicToken = await connectAppleMusic();

        if (appleMusicToken) {
          await axios({
            url: "/v1/applemusic/gate",
            data: {
              music_user_token: appleMusicToken,
              edition_address: edition.contract_address,
            },
            method: "POST",
          });

          toast.success(
            "You just saved this song to your library! Sign in now to collect this drop."
          );
          await loginPromise();
          await onboardingPromise();

          await saveAppleMusicToken({
            token: appleMusicToken,
          });
          await claimNFT({ closeModal });
        }
      } catch (error: any) {
        Logger.error("claimAppleMusicGatedDrop failed", error);
      }
    }
  };

  return { claimAppleMusicGatedDrop };
};
