import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useClaimNFT } from "app/hooks/use-claim-nft";
import { getQueryString } from "app/lib/spotify";
import { redirectUri } from "app/lib/spotify/queryString";

import { Logger } from "../lib/logger";
import { IEdition, NFT } from "../types";
import { useSaveSpotifyToken } from "./use-save-spotify-token";
import { useUser } from "./use-user";

export const useSpotifyGatedClaim = (edition: IEdition) => {
  const user = useUser();
  const { claimNFT } = useClaimNFT(edition);
  const { saveSpotifyToken } = useSaveSpotifyToken();
  const Alert = useAlert();

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
          try {
            const queryString = getQueryString(nft, user?.user);

            const res = await WebBrowser.openAuthSessionAsync(
              queryString,
              redirectUri
            );
            if (res.type === "success") {
              let urlObj = new URL(res.url);
              const code = urlObj.searchParams.get("code");
              if (code) {
                await saveSpotifyToken({ code, redirectUri: redirectUri });
              }
            } else {
              Alert.alert("Error", "Something went wrong");
            }
          } catch (e) {
            Logger.error("native spotify auth failed", e);
            Alert.alert("Error", "Something went wrong");
          }
        }
      }
    }
  };

  return { claimSpotifyGatedDrop };
};
