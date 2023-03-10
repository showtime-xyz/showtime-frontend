import { useAlert } from "@showtime-xyz/universal.alert";

import { Logger } from "app/lib/logger";

import { useGetSpotifyToken } from "./use-get-spotify-token";
import { useSaveSpotifyToken } from "./use-save-spotify-token";

export const useConnectSpotify = () => {
  const { saveSpotifyToken } = useSaveSpotifyToken();
  const Alert = useAlert();
  const { getSpotifyToken } = useGetSpotifyToken();

  const connectSpotify = async () => {
    try {
      const res = await getSpotifyToken();
      if (res?.code) {
        await saveSpotifyToken({
          code: res?.code,
          redirectUri: res?.redirectUri,
        });
        return res;
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
