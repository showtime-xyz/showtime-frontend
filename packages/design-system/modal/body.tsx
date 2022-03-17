import React, { useRef } from "react";
import { ScrollView } from "react-native";

import { tw as tailwind } from "../tailwind";
import type { TW } from "../tailwind/types";
import { View } from "../view";
import { BODY_CONTAINER_TW, BODY_TW } from "./constants";
import type { ModalProps } from "./types";

interface ModalBodyProps extends Pick<ModalProps, "children" | "scrollable"> {
  tw?: TW;
  contentTW?: TW;
}

export function ModalBody({
  tw,
  contentTW,
  scrollable,
  children,
}: ModalBodyProps) {
  const containerStyle = scrollable
    ? tailwind.style(BODY_CONTAINER_TW, tw)
    : tailwind.style("flex-1", BODY_CONTAINER_TW, BODY_TW, tw, contentTW);
  const contentContainerStyle = tailwind.style(BODY_TW, contentTW);

  const BodyWrapper = scrollable ? ScrollView : View;
  return (
    <BodyWrapper
      style={containerStyle}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </BodyWrapper>
  );
}
