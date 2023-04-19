import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { useScript } from "../use-script";

export const useGetAppleMusicToken = () => {
  useScript("https://js-cdn.music.apple.com/musickit/v3/musickit.js");

  const fetcher = async () => {
    const res = await axios({
      url: "/v1/apple_music/get-dev-token",
      method: "GET",
    });

    const developerToken = res.developer_token;
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
  };

  const state = useSWRMutation(MY_INFO_ENDPOINT, fetcher);

  return { getAppleMusicToken: state.trigger, ...state };
};
