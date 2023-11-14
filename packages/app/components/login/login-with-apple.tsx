import { useEffect } from "react";

import {
  useOAuthFlow,
  usePrivy,
  useEmbeddedWallet,
  isNotCreated,
} from "@privy-io/expo";

import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { usePreviousValue } from "app/hooks/use-previous-value";
import { Logger } from "app/lib/logger";

import { LoginButton } from "./login-button";

export const LoginWithApple = () => {
  const { setAuthenticationStatus, login, logout } = useAuth();
  const router = useRouter();
  const { start } = useOAuthFlow();
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();
  const previousUser = usePreviousValue(user);
  useEffect(() => {
    async function loginUser() {
      if (!previousUser && user) {
        try {
          setAuthenticationStatus("AUTHENTICATING");
          if (isNotCreated(wallet)) {
            await wallet.create();
          }

          await login("/v2/login/privy", {
            did: user.id,
          });
          router.pop();
        } catch (error) {
          Logger.error(error);
          logout();
        }
      }
    }
    loginUser();
  }, [
    isReady,
    login,
    logout,
    previousUser,
    router,
    setAuthenticationStatus,
    user,
    wallet,
  ]);

  return (
    <LoginButton
      type="apple"
      onPress={async () => {
        start({
          provider: "apple",
          redirectUri: "privy-success",
        });
      }}
    />
  );
};
