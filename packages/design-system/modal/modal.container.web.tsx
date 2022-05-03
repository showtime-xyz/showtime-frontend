import { memo, useMemo } from "react";
import { StyleSheet } from "react-native";

import { RemoveScrollBar } from "react-remove-scroll-bar";

import { View } from "../view";
import { WEB_HEIGHT } from "./constants";
import { ModalBackdrop } from "./modal.backdrop";
import { ModalHeader } from "./modal.header";
import type { ModalContainerProps } from "./types";

const CONTAINER_TW = [
  "top-0 right-0 bottom-0 left-0",
  "flex items-center justify-end sm:justify-center",
];

const MODAL_CONTAINER_TW = [
  "flex overflow-hidden justify-center",
  "w-full	sm:w-480px",
  "bg-white dark:bg-black",
  "shadow-xl shadow-black dark:shadow-white",
  "rounded-t-[32px] rounded-b-0 sm:rounded-b-[32px] pb-5",
  "max-h-100vh",
];

const MODAL_BODY_TW = "flex-1 overflow-auto";

function ModalContainerComponent({
  title,
  web_height = WEB_HEIGHT,
  onClose,
  children,
}: ModalContainerProps) {
  const modalContainerTW = useMemo(
    () => [...MODAL_CONTAINER_TW, web_height],
    [web_height]
  );

  return (
    <View tw={CONTAINER_TW} style={styles.container}>
      {/* prevent scrolling/shaking when modal is open */}
      <RemoveScrollBar />
      <ModalBackdrop onClose={onClose} />
      <View tw={modalContainerTW}>
        <ModalHeader title={title} onClose={onClose} />
        <View tw={MODAL_BODY_TW}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "fixed" as any,
    zIndex: 999,
  },
});

export const ModalContainer = memo(ModalContainerComponent);
