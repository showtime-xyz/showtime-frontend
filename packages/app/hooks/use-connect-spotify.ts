import * as WebBrowser from "expo-web-browser";

import { useAlert } from "@showtime-xyz/universal.alert";

import { Logger } from "app/lib/logger";
import { getQueryString } from "app/lib/spotify";
import { redirectUri } from "app/lib/spotify/queryString";

import { toast } from "design-system/toast";

import { useSaveSpotifyToken } from "./use-save-spotify-token";

export const useConnectSpotify = () => {
  const { saveSpotifyToken } = useSaveSpotifyToken();
  const Alert = useAlert();

  const connectSpotify = async () => {
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
          toast.success("Spotify connected");
          return true;
        }
      } else {
        Logger.error("Spotify auth failed", res);
        Alert.alert("Error", "Something went wrong");
      }
    } catch (e) {
      Logger.error("Spotify auth failed", e);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return { connectSpotify };
};
