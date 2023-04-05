import { useRouter } from "@showtime-xyz/universal.router";

import { useSaveAppleMusicToken } from "../use-save-apple-music-token";
import { tokenPromiseCallbacks } from "./utils";

export const useConnectAppleMusic = () => {
  const router = useRouter();
  const { saveAppleMusicToken } = useSaveAppleMusicToken();
  const connectAppleMusic = async () => {
    router.push("/appleMusicAuthNativeWebView");
    const promise = new Promise<string>((resolve) => {
      tokenPromiseCallbacks.resolve = resolve;
    });

    const token = await promise;
    console.log("token ", token);
    await saveAppleMusicToken({ token });
    return token;
  };

  return { connectAppleMusic };
};
