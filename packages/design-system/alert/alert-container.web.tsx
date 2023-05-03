import React from "react";
import { Platform, Modal } from "react-native";

import * as Portal from "@radix-ui/react-portal";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import { View } from "@showtime-xyz/universal.view";

import { Alert } from "./alert";
import { AlertContainerProps } from "./alert-container";

export const AlertContainer = ({ show, ...rest }: AlertContainerProps) => {
  return (
    <Portal.Root>
      <Modal
        animationType="none"
        transparent
        visible={show}
        statusBarTranslucent
      >
        {Platform.OS === "web" && <RemoveScrollBar />}
        <View tw="animate-fade-in absolute inset-0 bg-black bg-opacity-60" />
        <View tw="h-full w-full items-center justify-center">
          <View tw="animate-bounce-in w-4/5 max-w-xs rounded-2xl bg-white p-4 dark:bg-gray-900">
            <Alert {...rest} />
          </View>
        </View>
      </Modal>
    </Portal.Root>
  );
};
