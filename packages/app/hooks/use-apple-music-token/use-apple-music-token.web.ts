import { developerToken } from "./utils";

export const useAppleMusicToken = () => {
  const getUserToken = async () => {
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

  return {
    getUserToken,
  };
};
