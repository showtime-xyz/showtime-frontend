import React from "react";
import { Modal, StyleSheet } from "react-native";

import { MotiView } from "moti";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Alert, AlertProps } from "./alert";

export type AlertContainerProps = AlertProps & {
  show: boolean;
  onModalDismiss: () => void;
};

export const AlertContainer = ({
  show,
  onModalDismiss,
  ...rest
}: AlertContainerProps) => {
  const isDark = useIsDarkMode();

  return (
    <Modal
      animationType="none"
      transparent
      visible={show}
      statusBarTranslucent
      onDismiss={onModalDismiss}
    >
      <MotiView
        style={styles.backdrop}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "timing", duration: 120 }}
      />
      <View tw="h-full w-full items-center justify-center">
        <MotiView
          style={[
            styles.container,
            {
              backgroundColor: isDark ? colors.gray[900] : colors.white,
            },
          ]}
          from={{ transform: [{ scale: 1.1 }], opacity: 0 }}
          animate={{ transform: [{ scale: 1 }], opacity: 1 }}
          exit={{ transform: [{ scale: 1 }], opacity: 0 }}
          transition={{ type: "timing", duration: 250 }}
        >
          <Alert {...rest} />
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    maxWidth: 320,
    width: "80%",
  },
  backdrop: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
  },
});
