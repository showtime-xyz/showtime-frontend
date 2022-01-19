import React from "react";
import { View, Spinner } from "design-system";

interface LoginContainerProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoginContainer({
  loading = false,
  children,
}: LoginContainerProps) {
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
    </View>
  );
}
