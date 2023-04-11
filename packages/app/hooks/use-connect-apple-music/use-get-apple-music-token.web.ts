import useSWRMutation from "swr/mutation";

import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { developerToken } from "./utils";

export const useGetAppleMusicToken = () => {
  const state = useSWRMutation(MY_INFO_ENDPOINT, async () => {
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
  });

  return { getAppleMusicToken: state.trigger, ...state };
};
