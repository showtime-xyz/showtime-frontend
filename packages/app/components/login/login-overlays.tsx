import { memo, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Portal } from "@gorhom/portal";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useWeb3 } from "app/hooks/use-web3";
import { Relayer } from "app/lib/magic";

interface LoginOverlaysProps {
  loading?: boolean;
}

function LoginOverlaysComponent({ loading }: LoginOverlaysProps) {
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
    <Portal>
      {loading && (
        <View
          tw="items-center justify-center bg-white opacity-[0.95] dark:bg-black dark:opacity-[0.85]"
          style={StyleSheet.absoluteFill}
        >
          <Spinner />
        </View>
      )}

      {mountRelayer ? <Relayer /> : null}
    </Portal>
  );
}

export const LoginOverlays = memo(LoginOverlaysComponent);
