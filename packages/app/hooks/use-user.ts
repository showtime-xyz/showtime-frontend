import { useContext, useEffect } from "react";

import { useRouter } from "@showtime-xyz/universal.router";

import { UserContext } from "app/context/user-context";
import {
  useNavigateToLogin,
  useNavigateToOnboarding,
} from "app/navigation/use-navigate-to";

type UserParams = {
  redirectTo?: string;
  redirectIfProfileIncomplete?: boolean;
};
export function useUser(params?: UserParams) {
  const context = useContext(UserContext);
  const router = useRouter();
  const navigateToOnboarding = useNavigateToOnboarding();
  const navigateToLogin = useNavigateToLogin();
  useEffect(() => {
    if (!context?.isAuthenticated && params?.redirectTo && router) {
      if (params.redirectTo === "/login") {
        navigateToLogin();
      } else {
        router.replace(params?.redirectTo);
      }
    }
    if (
      context?.isAuthenticated &&
      params?.redirectIfProfileIncomplete &&
      context?.isIncompletedProfile &&
      router
    ) {
      navigateToOnboarding({ replace: true });
    }
  }, [
    context?.isAuthenticated,
    context?.isIncompletedProfile,
    navigateToLogin,
    navigateToOnboarding,
    params?.redirectIfProfileIncomplete,
    params?.redirectTo,
    router,
  ]);

  if (!context) {
    throw "You need to add `UserProvider` to your root component";
  }

  return context;
}
