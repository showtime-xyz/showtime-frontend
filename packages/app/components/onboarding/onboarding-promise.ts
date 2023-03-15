import { useStableCallback } from "app/hooks/use-stable-callback";
import { useUser } from "app/hooks/use-user";
import { Logger } from "app/lib/logger/index";
import { useNavigateToOnboarding } from "app/navigation/use-navigate-to";

export let onboardingPromiseCallbacks = {
  resolve: null as ((v: unknown) => void) | null,
  reject: null as ((v: unknown) => void) | null,
};

export const useOnboardingPromise = () => {
  const { isIncompletedProfile, isAuthenticated } = useUser();
  const navigateToOnboarding = useNavigateToOnboarding();
  const onboardingPromise = useStableCallback(
    () =>
      new Promise((resolve, reject) => {
        if (isAuthenticated) {
          if (isIncompletedProfile) {
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
