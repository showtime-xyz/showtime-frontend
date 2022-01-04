import React from "react";
import { SxProp } from "dripsy";
import { View } from "design-system/view";
import { Header } from "./header";
import { ModalBackdrop } from "./backdrop";
import { ModalBody } from "./body";
import {
  CONTAINER_TW,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  MODAL_TW,
} from "./constants";
import type { ModalProps } from "./types";

export function Modal({
  title,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  close,
  children,
}: ModalProps) {
  return (
    <View tw={CONTAINER_TW} sx={stylesX.container}>
      <ModalBackdrop close={close} />
      <View
        tw={[MODAL_TW, width, height]}
        sx={stylesX.modal}
      >
        <Header title={title} close={close} />
        <ModalBody>{children}</ModalBody>
      </View>
    </View>
  );
}

const stylesX = {
  container: { position: "fixed" } as SxProp,
  modal: {
    position: "fixed",
  } as SxProp,
};
