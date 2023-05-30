import { axios } from "app/lib/axios";
import { delay } from "app/utilities";

export let appleMusicAuth = {
  music: null,
};

export const initialiseAppleMusic = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await axios({
      url: "/v1/apple_music/get-dev-token",
      method: "GET",
    });
    const developerToken = res.developer_token;

    //@ts-ignore
    appleMusicAuth.music = await window.MusicKit.configure({
      developerToken,
      app: {
        name: "Showtime",
        build: "1978.4.1",
      },
    });

    // 2 hours validity
    await delay(2 * 60 * 60 * 1000);
  }
};
