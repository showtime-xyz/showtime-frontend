import { useEffectOnce } from "@showtime-xyz/universal.hooks";

import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { useAuth } from "./auth/use-auth";

// Add this hook to screen that requires authentication
export const useAuthScreen = () => {
  const navigateToLogin = useNavigateToLogin();
  const { authenticationStatus } = useAuth();
  useEffectOnce(() => {
    if (authenticationStatus === "UNAUTHENTICATED") {
      navigateToLogin();
    }
  });
};
