import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useClaimNFT } from "app/hooks/use-claim-nft";
import { getQueryString } from "app/lib/spotify";

import { IEdition, NFT } from "../types";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const router = useRouter();
  const { claimNFT } = useClaimNFT(edition);

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
          const queryString = getQueryString(nft, user?.user);
          window.location.href = queryString;
        } else {
          const queryString = getQueryString(nft, user?.user);
          router.push(`/spotifyAuth?uri=${encodeURIComponent(queryString)}`);
        }
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
