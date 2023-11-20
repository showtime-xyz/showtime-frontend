import { memo } from "react";
import { StyleSheet } from "react-native";

import { Portal } from "@gorhom/portal";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

interface LoginOverlaysProps {
  loading?: boolean;
}

function LoginOverlaysComponent({ loading }: LoginOverlaysProps) {
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
    </Portal>
  );
}

export const LoginOverlays = memo(LoginOverlaysComponent);
