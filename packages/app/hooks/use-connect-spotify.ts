import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";

import { useAlert } from "@showtime-xyz/universal.alert";

import { Logger } from "app/lib/logger";
import { getQueryString } from "app/lib/spotify";
import { redirectUri } from "app/lib/spotify/queryString";

import { useSaveSpotifyToken } from "./use-save-spotify-token";

export const useConnectSpotify = () => {
  const { saveSpotifyToken } = useSaveSpotifyToken();
  const Alert = useAlert();

  const connectSpotify = async (_redirectURI?: string) => {
    if (Platform.OS === "web") {
      const queryString = getQueryString(_redirectURI);
      window.location.href = queryString;
    } else {
      try {
        const queryString = getQueryString();

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
  };

  return { connectSpotify };
};
