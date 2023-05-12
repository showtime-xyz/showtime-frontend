import useSWRMutation from "swr/mutation";

import { useRouter } from "@showtime-xyz/universal.router";

import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { tokenPromiseCallbacks } from "./utils";

export const useGetAppleMusicToken = () => {
  const router = useRouter();
  const state = useSWRMutation(MY_INFO_ENDPOINT, async () => {
    router.push("/appleMusicAuthNativeWebView");
    const promise = new Promise<string>((resolve, reject) => {
      tokenPromiseCallbacks.resolve = resolve;
      tokenPromiseCallbacks.reject = reject;
    });

    const token = await promise;
    return token;
  });

  return { getAppleMusicToken: state.trigger, ...state };
};
