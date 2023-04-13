import { useAuth } from "app/hooks/auth/use-auth";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { Logger } from "app/lib/logger/index";
import { useNavigateToOnboarding } from "app/navigation/use-navigate-to";

export let onboardingPromiseCallbacks = {
  resolve: null as ((v: unknown) => void) | null,
  reject: null as ((v: unknown) => void) | null,
};

export const useOnboardingPromise = () => {
  const { authStateRef } = useAuth();
  const navigateToOnboarding = useNavigateToOnboarding();
  const onboardingPromise = useStableCallback(
    () =>
      new Promise((resolve, reject) => {
        if (authStateRef.current.isAuthenticated) {
          if (authStateRef.current.isIncompletedProfile) {
            navigateToOnboarding();
            onboardingPromiseCallbacks.resolve = resolve;
            onboardingPromiseCallbacks.reject = reject;
          } else {
            resolve(true);
          }
        } else {
          Logger.log("onboarding promise: User is not authenticated");
        }
      })
  );

  return {
    onboardingPromise,
  };
};
