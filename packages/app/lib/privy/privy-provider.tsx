// Import required polyfils first
import "@ethersproject/shims";

import React from "react";

import { usePrivy } from "@privy-io/expo";
import { PrivyProvider as PrivyProviderImpl } from "@privy-io/expo";
import "react-native-get-random-values";

export function PrivyProvider(props: any) {
  return (
    <PrivyProviderImpl appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}>
      {props.children}
    </PrivyProviderImpl>
  );
}

export const usePrivyLogout = () => {
  const { logout } = usePrivy();
  return logout;
};
