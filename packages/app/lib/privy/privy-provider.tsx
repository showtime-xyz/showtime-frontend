import { useState, useEffect } from "react";

import {
  PrivyProvider as PrivyProviderImpl,
  User,
  usePrivy,
  PrivyInterface,
} from "@privy-io/react-auth";
import { useColorScheme } from "nativewind";

import { baseChain } from "app/hooks/creator-token/utils";

export const PrivyProvider = ({ children }: any) => {
  const handleLogin = (user: User) => {
    console.log(`User logged in! `, user);
  };
  const colorScheme = useColorScheme();

  return (
    <PrivyProviderImpl
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      onSuccess={handleLogin}
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
      <PrivyAuth>{children}</PrivyAuth>
    </PrivyProviderImpl>
  );
};

export const privyRef = {
  current: null,
} as { current: PrivyInterface | null };

const PrivyAuth = (props: any) => {
  const privy = usePrivy();
  if (!privy.ready) {
    return null;
  }

  privyRef.current = privy;

  return props.children;
};
