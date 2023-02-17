import { useContext, useEffect } from "react";

import { useRouter } from "@showtime-xyz/universal.router";

import { UserContext } from "app/context/user-context";

type UserParams = {
  redirectTo?: string;
};
export function useUser(params?: UserParams) {
  const context = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!context?.isAuthenticated && params?.redirectTo && router) {
      router.replace(params?.redirectTo);
    }
  }, [context?.isAuthenticated, params?.redirectTo, router]);

  if (!context) {
    throw "You need to add `UserProvider` to your root component";
  }

  return context;
}
