import { useRouter } from "@showtime-xyz/universal.router";

import { tokenPromiseCallbacks } from "./utils";

export const useAppleMusicToken = () => {
  const router = useRouter();
  const getUserToken = () => {
    router.push("/appleMusicAuthNativeWebView");
    return new Promise((resolve) => {
      tokenPromiseCallbacks.resolve = resolve;
    });
  };

  return { getUserToken };
};
