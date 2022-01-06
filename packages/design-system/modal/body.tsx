import React from "react";
import { ScrollView } from "react-native";
import { tw as tailwind } from "../tailwind";
import { BODY_CONTAINER_TW, BODY_TW } from "./constants";
import type { ModalProps } from "./types";

interface ModalBodyProps extends Pick<ModalProps, "children"> {
  tw?: string
}

export function ModalBody({ tw, children }: ModalBodyProps) {
  const containerStyle = tailwind.style(BODY_CONTAINER_TW, tw)
  const contentContainerStyle = tailwind.style(BODY_TW)
  return (
    <ScrollView style={containerStyle} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
}
