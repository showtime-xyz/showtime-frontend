import { useCallback } from "react";
import { Platform } from "react-native";

import { MMKV } from "react-native-mmkv";

import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";
import { useLogInPromise } from "app/lib/login-promise";

const store = new MMKV();
const STORE_KEY = "showExplanationv2";
export const useRedirectToCreateDrop = () => {
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();

  const router = useRouter();

  const redirectToCreateDrop = useCallback(async () => {
    // check if user is logged in
    await loginPromise();
    // check if user has completed onboarding
    await onboardingPromise();

    if (store.getBoolean(STORE_KEY)) {
      router.push(
        Platform.select({
          native: "/dropExplanation",
          web: {
            pathname: router.pathname,
            query: { ...router.query, dropExplanationModal: true },
          } as any,
        }),
        Platform.select({
          native: "/dropExplanation",
          web: router.asPath === "/" ? "/dropExplanation" : router.asPath,
        }),
        { shallow: true }
      );
    } else {
      // redirect to create drop
      router.push(
        Platform.select({
          native: "/drop",
          web: {
            pathname: router.pathname,
            query: { ...router.query, dropModal: true },
          } as any,
        }),
        Platform.select({
          native: "/drop",
          web: router.asPath === "/" ? "/drop" : router.asPath,
        }),
        { shallow: true }
      );
    }
  }, [loginPromise, onboardingPromise, router]);

  return redirectToCreateDrop;
};
