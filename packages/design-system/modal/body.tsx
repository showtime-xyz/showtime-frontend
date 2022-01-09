import React, { useEffect, useRef } from "react";
import { ScrollView, Keyboard } from "react-native";
import { tw as tailwind } from "../tailwind";
import { BODY_CONTAINER_TW, BODY_TW } from "./constants";
import type { ModalProps } from "./types";
import type { TW } from "../tailwind/types";

interface ModalBodyProps extends Pick<ModalProps, "children"> {
  tw?: TW;
}

export function ModalBody({ tw, children }: ModalBodyProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const containerStyle = tailwind.style(BODY_CONTAINER_TW, tw);
  const contentContainerStyle = tailwind.style(BODY_TW);

  useEffect(() => {
    const keyboardListener = Keyboard.addListener("keyboardWillShow", () => {
      scrollViewRef.current.scrollToEnd();
    });

    return () => {
      Keyboard.removeSubscription(keyboardListener);
    };
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={containerStyle}
      contentContainerStyle={contentContainerStyle}
      keyboardDismissMode="on-drag"
    >
      {children}
    </ScrollView>
  );
}
