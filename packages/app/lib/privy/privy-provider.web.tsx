import { forwardRef, useRef, useEffect, useState, createContext } from "react";

import {
  PrivyProvider as PrivyProviderImpl,
  User as PrivyUser,
  usePrivy,
  PrivyInterface,
  useLogin,
} from "@privy-io/react-auth";
import * as Clipboard from "expo-clipboard";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Copy, Ethereum } from "@showtime-xyz/universal.icon";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAuth } from "app/hooks/auth/use-auth";
import { baseChain } from "app/hooks/creator-token/utils";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { useWallet } from "app/hooks/use-wallet";

import { toast } from "design-system/toast";

import { usePrivyFundWallet } from "./privy-hooks";

export const PrivySetLoginMethodContext = createContext<any>(null);

export const PrivyProvider = ({ children }: any) => {
  const colorScheme = useIsDarkMode() ? "dark" : "light";
  const [loginMethods, setLoginMethods] = useState<any>([
    "wallet",
    "sms",
    "google",
    "apple",
  ] as const);

  return (
    <PrivyProviderImpl
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: loginMethods,
        defaultChain: baseChain,
        embeddedWallets: {
          noPromptOnSignature: true,
        },
        appearance: {
          logo: "https://media.showtime.xyz/9864af22-44ed-4913-8d87-6d734a08edb3.jpg?optimizer=image&width=300",
          theme: colorScheme,
        },
        fiatOnRamp: {
          useSandbox: process.env.NEXT_PUBLIC_STAGE === "development",
        },
      }}
    >
      <PrivySetLoginMethodContext.Provider value={{ setLoginMethods }}>
        {children}
      </PrivySetLoginMethodContext.Provider>
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
  const { fundWallet } = usePrivyFundWallet();
  let prevAuthStatus = useRef<any>();
  const [showWalletCreated, setShowWalletCreated] = useState(false);

  const createWalletAndLogin = useStableCallback(async (user: PrivyUser) => {
    try {
      await privy.createWallet();
      setShowWalletCreated(true);
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
  const isDark = useIsDarkMode();

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

  return (
    <>
      {props.children}
      {showWalletCreated ? (
        <ModalSheet
          snapPoints={[240]}
          title="You just created a Showtime wallet!"
          visible={showWalletCreated}
          close={() => setShowWalletCreated(false)}
          onClose={() => setShowWalletCreated(false)}
        >
          <View tw="p-4">
            <Text tw="text-base">
              Your wallet is linked to your sign in method. Transfer or buy ETH
              (on the Base network only) to get started. You can manage your
              wallets in settings.
            </Text>
            <View tw="mt-4 w-full flex-row justify-between">
              <Button
                size="regular"
                tw="flex-1"
                onPress={() => {
                  fundWallet("eth");
                }}
              >
                <Ethereum
                  color={isDark ? "black" : "white"}
                  height={20}
                  width={20}
                />
                {"  "}
                Buy ETH
              </Button>
              <Button
                variant="text"
                size="regular"
                tw="flex-1"
                onPress={async () => {
                  if (wallet.address) {
                    await Clipboard.setStringAsync(wallet.address);
                    toast.success("Copied!");
                  }
                }}
              >
                Copy wallet{"  "}
                <Copy
                  color={isDark ? "white" : "black"}
                  height={20}
                  width={20}
                />
              </Button>
            </View>
            <Button
              tw="mt-3 flex-1"
              variant="outlined"
              size="regular"
              onPress={() => setShowWalletCreated(false)}
            >
              Continue
            </Button>
          </View>
        </ModalSheet>
      ) : null}
    </>
  );
});

export const usePrivyLogout = () => {
  const { logout } = usePrivy();
  return logout;
};
