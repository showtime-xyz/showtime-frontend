import { useSaveAppleMusicToken } from "../use-save-apple-music-token";
import { developerToken } from "./utils";

export const useConnectAppleMusic = () => {
  const { saveAppleMusicToken } = useSaveAppleMusicToken();

  const connectAppleMusic = async () => {
    //@ts-ignore
    const music = await window.MusicKit.configure({
      developerToken,
      app: {
        name: "Showtime",
        build: "1978.4.1",
      },
    });

    const token = await music.authorize();
    await saveAppleMusicToken({ token });
    return token;
  };

  return {
    connectAppleMusic,
  };
};
