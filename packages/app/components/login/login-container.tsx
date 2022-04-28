import React, { useEffect, useState } from "react";

import { useWeb3 } from "app/hooks/use-web3";
import { Relayer } from "app/lib/magic";

import { View, Spinner } from "design-system";

interface LoginContainerProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoginContainer({
  loading = false,
  children,
}: LoginContainerProps) {
  const { setMountRelayerOnApp } = useWeb3();
  const [mountRelayer, setMountRelayer] = useState(false);

  useEffect(() => {
    setMountRelayerOnApp(false);
    setMountRelayer(true);
    return () => {
      setMountRelayerOnApp(true);
    };
  }, [setMountRelayerOnApp]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "stretch",
        alignItems: "stretch",
      }}
    >
      {children}

      {loading && (
        <View tw="dark:opacity-85 absolute top--2 right-0 bottom--2 left-0 items-center justify-center bg-white opacity-95 dark:bg-black">
          <Spinner />
        </View>
      )}
      {mountRelayer ? <Relayer /> : null}
    </View>
  );
}
