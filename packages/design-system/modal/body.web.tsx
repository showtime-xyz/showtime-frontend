import React from "react";
import { Platform } from "react-native";
import { SxProp } from "dripsy";
import { View } from "../view";
import { BODY_CONTAINER_TW, BODY_TW } from "./constants";
import type { ModalProps } from "./types";

interface ModalBodyProps extends Pick<ModalProps, "children"> {}

export function ModalBody({ children }: ModalBodyProps) {
  return (
    <View tw={[BODY_CONTAINER_TW, BODY_TW]} sx={stylesX.container}>
      {children}
    </View>
  );
}

const stylesX = {
  container: { overflowY: "scroll" } as SxProp,
};
