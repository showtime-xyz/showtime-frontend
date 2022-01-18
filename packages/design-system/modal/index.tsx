import React from "react";
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "design-system/view";
import { Header } from "./header";
import { ModalBackdrop } from "./backdrop";
import { ModalBody } from "./body";
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  CONTAINER_TW,
  MODAL_TW,
} from "./constants";
import type { ModalProps } from "./types";

const ModalContainer = Platform.select({
  ios: ({ onDismiss: _, children }) => children,
  android: ({ children, onDismiss }) => (
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
});

const ModalKeyboardAvoidingView: React.FC<{
  keyboardVerticalOffset: number;
  style: any;
}> = Platform.select({
  web: ({ children }) => children as any,
  default: ({ keyboardVerticalOffset, style, children }) => (
    <KeyboardAvoidingView
      pointerEvents="box-none"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={style}
    >
      {children}
    </KeyboardAvoidingView>
  ),
});

export function Modal({
  title,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  bodyTW,
  keyboardVerticalOffset = 0,
  close,
  onDismiss,
  children,
}: ModalProps) {
  return (
    <ModalContainer onDismiss={onDismiss}>
      <View tw={CONTAINER_TW}>
        <ModalBackdrop close={close} />
        <ModalKeyboardAvoidingView
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "flex-end",
          }}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View
            tw={[
              width,
              height.length === 0 || !height ? "max-h-screen" : height,
              MODAL_TW,
            ]}
          >
            <Header title={title} close={close} />
            <ModalBody tw={bodyTW}>{children}</ModalBody>
          </View>
        </ModalKeyboardAvoidingView>
      </View>
    </ModalContainer>
  );
}
