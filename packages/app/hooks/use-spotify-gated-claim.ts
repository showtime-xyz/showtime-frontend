import { Linking, Platform } from "react-native";

import { useClaimNFT } from "app/providers/claim-provider";

import { IEdition, NFT } from "../types";
import { useUser } from "./use-user";

const clientId = "e12f7eea542947ff843cfc68d762235a";
const scope =
  "user-read-recently-played user-read-private user-read-email user-follow-modify user-follow-read user-library-modify user-library-read";

export const SPOTIFY_REDIRECT_URI = `${
  __DEV__
    ? "http://localhost:3000"
    : "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN
}/spotify-auth/redirect`;

export const useSpotifyGatedClaim = (edition?: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);

  const claimSpotifyGatedDrop = (nft?: NFT) => {
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
        const state = `chainName=${nft.chain_name}&tokenId=${nft.token_id}&contractAddress=${nft.contract_address}&userId=${user.user?.data.profile.profile_id}`;

        const params = {
          client_id: clientId,
          scope,
          redirect_uri: SPOTIFY_REDIRECT_URI,
          state,
          response_type: "code",
        };

        const queryString = Object.entries(params)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join("&");

        console.log(" queryString", queryString, state);

        if (Platform.OS === "web") {
          window.location.href = `https://accounts.spotify.com/authorize?${queryString}`;
        } else {
          Linking.openURL(
            `https://accounts.spotify.com/authorize?${queryString}`
          );
        }
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
