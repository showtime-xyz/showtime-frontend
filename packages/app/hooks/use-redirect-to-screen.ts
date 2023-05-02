import { useRouter } from "@showtime-xyz/universal.router";

import { useOnboardingPromise } from "app/components/onboarding";
import { useUser } from "app/hooks/use-user";
import { useLogInPromise } from "app/lib/login-promise";

export const useRedirectToScreen = () => {
  const { isAuthenticated } = useUser();
  const { loginPromise } = useLogInPromise();
  const { onboardingPromise } = useOnboardingPromise();
  const router = useRouter();
  const redirectToLogin = async ({
    redirectedCallback,
    pathname,
  }: {
    redirectedCallback?: () => void;
    pathname?: string;
  }) => {
    if (isAuthenticated) {
      pathname && router.push(pathname);
      redirectedCallback?.();
    } else {
      // check if user is logged in
      await loginPromise();
      // check if user has completed onboarding
      await onboardingPromise();
      pathname && router.push(pathname);
      redirectedCallback?.();
    }
  };

  return redirectToLogin;
};
