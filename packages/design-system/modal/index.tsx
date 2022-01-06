import React from "react";
import { Modal as RNModal, Platform } from "react-native";
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
  ios: ({ children }) => children,
  default: ({ children }) => <RNModal transparent={true}>{children}</RNModal>,
});

export function Modal({
  title,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  bodyTW,
  close,
  onDismiss,
  children,
}: ModalProps) {
  return (
    <ModalContainer>
      <View tw={CONTAINER_TW}>
        <ModalBackdrop close={close} />
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
      </View>
    </ModalContainer>
  );
}
