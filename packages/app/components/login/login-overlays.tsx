import { memo, useEffect, useState } from "react";

import { useWeb3 } from "app/hooks/use-web3";
import { Relayer } from "app/lib/magic";

import { View, Spinner } from "design-system";

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
    <>
      {loading && (
        <View tw="dark:opacity-85 absolute top--2 right-0 bottom--2 left-0 items-center justify-center bg-white opacity-95 dark:bg-black">
          <Spinner />
        </View>
      )}

      {mountRelayer ? <Relayer /> : null}
    </>
  );
}

export const LoginOverlays = memo(LoginOverlaysComponent);
