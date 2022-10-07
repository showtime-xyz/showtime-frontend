import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import {
  getQueryString,
  getSpotifyAuthCode,
  redirectUri,
} from "app/lib/spotify";
import { useClaimNFT } from "app/providers/claim-provider";

import { IEdition, NFT } from "../types";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition?: IEdition) => {
  const user = useUser();
  const router = useRouter();
  const { claimNFT } = useClaimNFT(edition);
  const { saveSpotifyToken } = useSaveSpotifyToken();

  const claimSpotifyGatedDrop = async (nft?: NFT) => {
    if (nft) {
      // if (false) {
      // TODO: remove this after testing
      if (user?.user?.data.profile.has_spotify_token) {
        try {
          const res = claimNFT();

          return res;
        } catch (error: any) {
          // TODO: handle error. Could be unauthorized, so we need to redirect to spotify auth flow
        }
      } else {
        if (Platform.OS === "web") {
          return getSpotifyAuthCode(nft, user?.user);
        } else if (Platform.OS === "ios") {
          const queryString = getQueryString(nft, user?.user);
          router.push(`/spotifyAuth?uri=${encodeURIComponent(queryString)}`);
        } else if (Platform.OS === "android") {
          const session = await getSpotifyAuthCode(nft, user?.user);
          await saveSpotifyToken({
            code: session.accessToken,
            redirectUri: redirectUri,
          });
        }
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
