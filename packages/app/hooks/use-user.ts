import { useContext, useEffect } from "react";

import { useRouter } from "@showtime-xyz/universal.router";

import { UserContext } from "app/context/user-context";

type UserParams = {
  redirectTo?: string;
  redirectIfProfileIncomplete?: boolean;
};
export function useUser(params?: UserParams) {
  const context = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!context?.isAuthenticated && params?.redirectTo && router) {
      router.replace(params?.redirectTo);
    }
    if (
      context?.isAuthenticated &&
      params?.redirectIfProfileIncomplete &&
      context?.isIncompletedProfile &&
      router
    ) {
      router.replace("/profile/onboarding");
    }
  }, [
    context?.isAuthenticated,
    context?.isIncompletedProfile,
    params?.redirectIfProfileIncomplete,
    params?.redirectTo,
    router,
  ]);

  if (!context) {
    throw "You need to add `UserProvider` to your root component";
  }

  return context;
}
