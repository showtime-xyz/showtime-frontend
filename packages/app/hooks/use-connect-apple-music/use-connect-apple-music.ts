import useSWRMutation from "swr/mutation";

import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { useSaveAppleMusicToken } from "../use-save-apple-music-token";
import { useGetAppleMusicToken } from "./use-get-apple-music-token";

export const useConnectAppleMusic = () => {
  const { saveAppleMusicToken } = useSaveAppleMusicToken();
  const { getAppleMusicToken } = useGetAppleMusicToken();
  const state = useSWRMutation(MY_INFO_ENDPOINT, async () => {
    const token = await getAppleMusicToken();
    if (token) {
      await saveAppleMusicToken({ token });
      return token;
    }
  });

  return { connectAppleMusic: state.trigger, ...state };
};
