import { Platform, StyleSheet, Modal as RNModal } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CONTAINER_TW } from "./constants";
import type { ModalWrapperProps } from "./types";

interface ModalContainer {
  onDismiss?: () => void;
  children: React.ReactNode;
}

export const createModalContainer = (
  ModalWrapper?: React.FC<ModalWrapperProps> | null
) =>
  Platform.select({
    ios: ({ children }: ModalContainer) => children,
    android: ({ children, onDismiss }: ModalContainer) =>
      ModalWrapper ? (
        <ModalWrapper tw={CONTAINER_TW}>{children}</ModalWrapper>
      ) : ModalWrapper === null ? (
        children
      ) : (
        <RNModal onDismiss={onDismiss} transparent={true}>
          <GestureHandlerRootView style={StyleSheet.absoluteFill}>
            {children}
          </GestureHandlerRootView>
        </RNModal>
      ),
    default: ({ children, onDismiss }) => (
      <RNModal onDismiss={onDismiss} transparent={true}>
        {children}
      </RNModal>
    ),
  }) as React.FC<ModalContainer>;
