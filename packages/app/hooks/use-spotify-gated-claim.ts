import { useClaimNFT } from "app/hooks/use-claim-nft";

import { IEdition, NFT } from "../types";
import { useConnectSpotify } from "./use-connect-spotify";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);
  const { connectSpotify } = useConnectSpotify();

  const claimSpotifyGatedDrop = async (nft?: NFT, closeModal?: () => void) => {
    if (nft) {
      // if (false) {
      // TODO: remove this after testing
      if (user?.user?.data.profile.has_spotify_token) {
        try {
          const res = claimNFT({ closeModal });

          return res;
        } catch (error: any) {
          // TODO: handle error. Could be unauthorized, so we need to redirect to spotify auth flow
        }
      } else {
        return connectSpotify();
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
