import useSWRMutation from "swr/mutation";

import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { useScript } from "../use-script";
import { developerToken } from "./utils";

export const useGetAppleMusicToken = () => {
  const scriptRes = useScript(
    "https://js-cdn.music.apple.com/musickit/v3/musickit.js"
  );
  const state = useSWRMutation(MY_INFO_ENDPOINT, async () => {
    if (scriptRes === "ready") {
      //@ts-ignore
      const music = await window.MusicKit.configure({
        developerToken,
        app: {
          name: "Showtime",
          build: "1978.4.1",
        },
      });

      const token = await music.authorize();
      return token;
    }
  });

  return { getAppleMusicToken: state.trigger, ...state };
};
