import { Linking } from "react-native";

import { IEdition } from "../types";
import { useClaimNFT } from "./use-claim-nft";
import { useUser } from "./use-user";

const clientId = "e12f7eea542947ff843cfc68d762235a";
const scope =
  "user-read-recently-played user-read-private user-read-email user-follow-modify user-follow-read user-library-modify user-library-read";

const generateState = (nftId: number, userId?: number) => {
  const state = `nftId=${nftId}&userId=${userId}`;

  return state;
};

export const useSpotifyGatedClaim = (edition?: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);

  const claimSpotifyGatedDrop = (nftId?: number) => {
    if (nftId) {
      if (user?.user?.data.profile.has_spotify_token) {
        try {
          const res = claimNFT();

          return res;
        } catch (error: any) {
          // TODO: handle error. Could be unauthorized, so we need to redirect to spotify auth flow
        }
      } else {
        const state = generateState(nftId, user.user?.data.profile.profile_id);

        const params = {
          client_id: clientId,
          scope,
          redirect_uri: `http://localhost:3000/spotify-auth/redirect`,
          state,
          response_type: "code",
        };

        const queryString = Object.entries(params)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join("&");

        console.log(" queryString", queryString, state);

        Linking.openURL(
          `https://accounts.spotify.com/authorize?${queryString}`
        );
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
