import * as WebBrowser from "expo-web-browser";

import { Logger } from "app/lib/logger";
import { getQueryString } from "app/lib/spotify";
import { redirectUri } from "app/lib/spotify/queryString";

export const useGetSpotifyToken = () => {
  const getSpotifyToken = async () => {
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
          return { code, redirectUri: redirectUri };
        }
      } else {
        Logger.error("Spotify auth failed", res);
        throw new Error("Spotify auth failed");
      }
    } catch (e) {
      Logger.error("Spotify auth failed", e);
      throw e;
    }
  };

  return { getSpotifyToken };
};
