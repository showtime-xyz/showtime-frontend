import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { Analytics, EVENTS } from "app/lib/analytics";
import { appleMusicAuth } from "app/lib/apple-music-auth/apple-music-auth";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

export const useGetAppleMusicToken = () => {
  const Alert = useAlert();

  const fetcher = async () => {
    try {
      if (appleMusicAuth.music) {
        // @ts-ignore
        const token = await appleMusicAuth.music.authorize();
        return token;
      }
    } catch (e) {
      Analytics.track(EVENTS.APPLE_MUSIC_AUTH_FAILED);
      Alert.alert(
        "Error connecting to Apple Music",
        "Please make sure you have an active Apple Music subscription."
      );
      throw e;
    }
  };

  const state = useSWRMutation(MY_INFO_ENDPOINT, fetcher);

  return { getAppleMusicToken: state.trigger, ...state };
};
