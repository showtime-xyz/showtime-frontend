import { useAuth } from "app/hooks/auth/use-auth";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

export let loginPromiseCallbacks = {
  resolve: null as ((v: unknown) => void) | null,
  reject: null as ((v: unknown) => void) | null,
};

export const useLogInPromise = () => {
  const { accessToken } = useAuth();
  const navigateToLogin = useNavigateToLogin();
  const loginPromise = useStableCallback(
    () =>
      new Promise((resolve, reject) => {
        if (accessToken) {
          resolve(true);
        } else {
          navigateToLogin();
          loginPromiseCallbacks.resolve = resolve;
          loginPromiseCallbacks.reject = reject;
        }
      })
  );

  return {
    loginPromise,
  };
};
