// Import required polyfils first
import "@ethersproject/shims";

import { useEffect } from "react";

import { usePrivy, useEmbeddedWallet, isNotCreated } from "@privy-io/expo";
import { PrivyProvider as PrivyProviderImpl } from "@privy-io/expo";
import "react-native-get-random-values";

import { useRouter } from "@showtime-xyz/universal.router";

import { useAuth } from "app/hooks/auth/use-auth";
import { usePreviousValue } from "app/hooks/use-previous-value";

import { Logger } from "../logger";

export function PrivyProvider(props: any) {
  return (
    <PrivyProviderImpl appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}>
      {props.children}
    </PrivyProviderImpl>
  );
}

export const PrivyAuth = (props: any) => {
  const wallet = useEmbeddedWallet();
  const { user } = usePrivy();
  const previousUser = usePreviousValue(user);
  const { setAuthenticationStatus, authenticationStatus, login, logout } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loginUser() {
      if (!previousUser && user && authenticationStatus === "UNAUTHENTICATED") {
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
    authenticationStatus,
    login,
    logout,
    previousUser,
    router,
    setAuthenticationStatus,
    user,
    wallet,
  ]);

  return props.children;
};

export const usePrivyLogout = () => {
  const { logout } = usePrivy();
  return logout;
};
