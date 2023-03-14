import { useStableCallback } from "app/hooks/use-stable-callback";
import { useUser } from "app/hooks/use-user";
import { useNavigateToOnboarding } from "app/navigation/use-navigate-to";

export let onboardingPromiseCallbacks = {
  resolve: null as ((v: unknown) => void) | null,
  reject: null as ((v: unknown) => void) | null,
};

export const useOnboardingPromise = () => {
  const { isIncompletedProfile } = useUser();
  const navigateToOnboarding = useNavigateToOnboarding();
  const onboardingPromise = useStableCallback(
    () =>
      new Promise((resolve, reject) => {
        if (isIncompletedProfile) {
          navigateToOnboarding();
          onboardingPromiseCallbacks.resolve = resolve;
          onboardingPromiseCallbacks.reject = reject;
        } else {
          resolve(true);
        }
      })
  );

  return {
    onboardingPromise,
  };
};
