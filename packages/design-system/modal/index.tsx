import React from "react";
import { Modal as RNModal } from "react-native";
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

export function Modal({
  title,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  close,
  onDismiss,
  children,
}: ModalProps) {
  return (
    <RNModal transparent={true} statusBarTranslucent={true} onDismiss={onDismiss}>
      <View tw={CONTAINER_TW}>
        <ModalBackdrop close={close} />
        <View
          tw={[
            MODAL_TW,
            width,
            height.length === 0 || !height ? "max-h-screen" : height,
          ]}
        >
          <Header title={title} close={close} />
          <ModalBody>{children}</ModalBody>
        </View>
      </View>
    </RNModal>
  );
}
