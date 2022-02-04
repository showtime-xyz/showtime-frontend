import React, { useContext, useEffect, useState } from "react";
import { View, Spinner } from "design-system";
import { AppContext } from "../../context/app-context";
import { Relayer } from "../../lib/magic";

interface LoginContainerProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoginContainer({
  loading = false,
  children,
}: LoginContainerProps) {
  const context = useContext(AppContext);
  const [mountRelayer, setMountRelayer] = useState(false);

  useEffect(() => {
    context.setMountRelayerOnApp(false);
    setMountRelayer(true);
    return () => {
      context.setMountRelayerOnApp(true);
    };
  }, []);

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
        <View tw="absolute top--2 right-0 bottom--2 left-0 opacity-95 dark:opacity-85 bg-white dark:bg-black justify-center items-center">
          <Spinner />
        </View>
      )}
      {mountRelayer ? <Relayer /> : null}
    </View>
  );
}
