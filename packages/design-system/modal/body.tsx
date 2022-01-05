import React from "react";
import { ScrollView } from "react-native";
import { tw } from "../tailwind";
import { BODY_CONTAINER_TW, BODY_TW } from "./constants";
import type { ModalProps } from "./types";

interface ModalBodyProps extends Pick<ModalProps, "children"> {}

export function ModalBody({ children }: ModalBodyProps) {
  const containerStyle = tw.style(BODY_CONTAINER_TW)
  const contentContainerStyle = tw.style(BODY_TW)
  return (
    <ScrollView style={containerStyle} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
}
