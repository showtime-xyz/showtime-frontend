import { useClaimNFT } from "app/hooks/use-claim-nft";

import { IEdition, NFT } from "../types";
import { useConnectSpotify } from "./use-connect-spotify";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);
  const { connectSpotify } = useConnectSpotify();

  const claimSpotifyGatedDrop = async (nft?: NFT) => {
    if (nft) {
      // if (false) {
      // TODO: remove this after testing
      if (user?.user?.data.profile.has_spotify_token) {
        try {
          const res = claimNFT({});

          return res;
        } catch (error: any) {
          // TODO: handle error. Could be unauthorized, so we need to redirect to spotify auth flow
        }
      } else {
        return connectSpotify(
          `/nft/${nft?.chain_name}/${nft?.contract_address}/${nft?.token_id}?showClaim=true`
        );
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
