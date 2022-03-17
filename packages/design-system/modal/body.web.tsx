import React from "react";

import { SxProp } from "dripsy";

import { View } from "../view";
import { BODY_CONTAINER_TW, BODY_TW } from "./constants";
import type { ModalProps } from "./types";

interface ModalBodyProps extends Pick<ModalProps, "children"> {
  tw?: string;
}

export function ModalBody({ tw, children }: ModalBodyProps) {
  return (
    <View tw={[BODY_CONTAINER_TW, BODY_TW, tw]} sx={stylesX.container}>
      {children}
    </View>
  );
}

const stylesX = {
  container: { overflowY: "scroll" } as SxProp,
};
