import { forwardRef, useImperativeHandle, useRef } from "react";

import {
  PrivyProvider as PrivyProviderImpl,
  User,
  usePrivy,
  PrivyInterface,
} from "@privy-io/react-auth";
import { useColorScheme } from "nativewind";

import { baseChain } from "app/hooks/creator-token/utils";
import { useStableCallback } from "app/hooks/use-stable-callback";

export const PrivyProvider = ({ children }: any) => {
  const privyAuthRef = useRef<any>(null);
  const handleLoginSuccess = (user: User) => {
    console.log(`User logged in! `, user);
    privyAuthRef.current.createWalletAndLogin();
  };
  const colorScheme = useColorScheme();

  return (
    <PrivyProviderImpl
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      onSuccess={handleLoginSuccess}
      config={{
        loginMethods: ["email", "google", "apple", "sms"],
        defaultChain: baseChain,
        appearance: {
          theme: colorScheme.colorScheme,
          accentColor: "#676FFF",
          logo: "https://pbs.twimg.com/profile_images/1720182212468051968/CPBHLyGx_400x400.jpg",
        },
      }}
    >
      <PrivyAuth ref={privyAuthRef}>{children}</PrivyAuth>
    </PrivyProviderImpl>
  );
};

export const privyRef = {
  current: null,
} as { current: PrivyInterface | null };

const PrivyAuth = forwardRef(function PrivyAuth(props: any, ref) {
  const privy = usePrivy();

  const createWalletAndLogin = useStableCallback(async () => {
    try {
      await privy.createWallet();
    } catch (e) {
      console.log("wallet is already created by privy!");
      // Probably already created
    }

    try {
      // Call backend login with privy method
    } catch (e) {
      privy.logout();
    }
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        createWalletAndLogin,
      };
    },
    [createWalletAndLogin]
  );

  if (!privy.ready) {
    return null;
  }

  privyRef.current = privy;

  return props.children;
});
