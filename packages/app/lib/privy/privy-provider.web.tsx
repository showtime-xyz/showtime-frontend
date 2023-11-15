import { forwardRef, useRef, useEffect } from "react";

import {
  PrivyProvider as PrivyProviderImpl,
  User as PrivyUser,
  usePrivy,
  PrivyInterface,
  useLogin,
} from "@privy-io/react-auth";

import { useAuth } from "app/hooks/auth/use-auth";
import { baseChain } from "app/hooks/creator-token/utils";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { useWallet } from "app/hooks/use-wallet";

export const PrivyProvider = ({ children }: any) => {
  return (
    <PrivyProviderImpl
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ["sms", "google", "apple"],
        defaultChain: baseChain,
        embeddedWallets: {
          noPromptOnSignature: true,
        },
        appearance: {
          accentColor: "#676FFF",
          logo: "https://pbs.twimg.com/profile_images/1720182212468051968/CPBHLyGx_400x400.jpg",
        },
      }}
    >
      {children}
    </PrivyProviderImpl>
  );
};

export const privyRef = {
  current: null,
} as { current: PrivyInterface | null };

export const PrivyAuth = forwardRef(function PrivyAuth(props: any, ref) {
  const privy = usePrivy();
  const { authenticationStatus, setAuthenticationStatus, login, logout } =
    useAuth();
  const wallet = useWallet();
  let prevAuthStatus = useRef<any>();

  const createWalletAndLogin = useStableCallback(async (user: PrivyUser) => {
    try {
      await privy.createWallet();
    } catch (e) {
      console.log("wallet is already created by privy!");
    }

    try {
      setAuthenticationStatus("AUTHENTICATING");
      await login("/v2/login/privy", {
        did: user.id,
      });
    } catch (e) {
      privy.logout();
      logout();
    }
  });

  useLogin({
    onComplete: (
      user: PrivyUser,
      isNewUser: boolean,
      wasAlreadyAuthenticated: boolean
    ) => {
      if (!wasAlreadyAuthenticated) {
        createWalletAndLogin(user);
      }
    },
  });

  const disconnect = wallet.disconnect;

  // TODO: remove this when we have a better way to handle this. Providers hierarchy is not ideal.
  useEffect(() => {
    if (
      authenticationStatus === "UNAUTHENTICATED" &&
      prevAuthStatus.current === "AUTHENTICATED"
    ) {
      privy.logout();
      disconnect();
    }

    prevAuthStatus.current = authenticationStatus;
  }, [authenticationStatus, privy, disconnect]);

  if (!privy.ready) {
    return null;
  }

  privyRef.current = privy;

  return props.children;
});

export const usePrivyLogout = () => {
  const { logout } = usePrivy();
  return logout;
};
