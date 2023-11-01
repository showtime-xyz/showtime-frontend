import { useCallback } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";
import { useLogInPromise } from "app/lib/login-promise";

export const useRedirectToCreateDrop = () => {
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();

  const router = useRouter();

  const redirectToCreateDrop = useCallback(async () => {
    // check if user is logged in
    await loginPromise();
    // check if user has completed onboarding
    await onboardingPromise();

    // redirect to pre save drop directly
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
  }, [loginPromise, onboardingPromise, router]);

  return redirectToCreateDrop;
};
