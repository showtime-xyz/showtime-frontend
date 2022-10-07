import { Platform } from "react-native";

import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { getSpotifyAuthCode } from "app/lib/spotify/spotify";
import { useClaimNFT } from "app/providers/claim-provider";

import { IEdition, NFT } from "../types";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition?: IEdition) => {
  const user = useUser();
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
          return getSpotifyAuthCode(nft);
        } else {
          const session = await getSpotifyAuthCode(nft);
          console.log("session", session);
          await saveSpotifyToken({
            code: session.accessToken,
            redirectUri: "io.showtime.development://spotify-success",
          });
        }
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
