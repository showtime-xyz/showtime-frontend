import { useClaimNFT } from "app/hooks/use-claim-nft";
import { Logger } from "app/lib/logger";

import { IEdition, NFT } from "../types";
import { useConnectSpotify } from "./use-connect-spotify";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);
  const { connectSpotify } = useConnectSpotify();

  const claimSpotifyGatedDrop = async (nft?: NFT, closeModal?: () => void) => {
    if (nft) {
      try {
        let spotifyConnected = user?.user?.data.profile.has_spotify_token;
        if (!spotifyConnected) {
          spotifyConnected = await connectSpotify();
        }
        if (spotifyConnected) {
          const res = claimNFT({ closeModal });
          return res;
        }
      } catch (error: any) {
        Logger.error("claimSpotifyGatedDrop failed", error);
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
