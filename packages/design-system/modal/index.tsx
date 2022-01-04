import React from "react";
import { Platform, StyleSheet } from "react-native";
import { SxProp } from "dripsy";
import { View } from "design-system/view";
import { Header } from "./header";
import { ModalBackdrop } from "./backdrop";

type Props = {
  /**
   * Defines the modal content.
   */
  children: React.ReactNode;
  /**
   * Defines the modal title.
   *
   * @default undefined
   */
  title?: string;
  /**
   * Defines the height style, set it empty to let
   * the modal be auto height.
   *
   * @default "max-h-280px"
   */
  height?: string;
  /**
   * Defines the width style.
   *
   * @default "w-10/12 max-w-480px md:w-480px lg:w-480px"
   */
  width?: string;
  /**
   * Defines the action to be fried to close
   * the modal.
   *
   * @default undefined
   */
  close?: () => void;
};

export function Modal({
  title,
  width = "w-10/12 max-w-480px md:w-480px lg:w-480px",
  height = "max-h-280px",
  close,
  children,
}: Props) {
  return (
    <View
      tw="z-99999 ios:absolute android:absolute top-0 right-0 bottom-0 left-0"
      sx={stylesX.container}
    >
      <ModalBackdrop close={close} />
      <View
        tw={[
          "flex overflow-hidden",
          "bg-white dark:bg-black",
          "shadow-lg shadow-black dark:shadow-white",
          width,
          height,
        ]}
        sx={stylesX.modal}
        style={styles.modal}
      >
        <Header title={title} close={close} />
        <View tw="flex-1 p-6 bg-gray-100 dark:bg-gray-900" sx={stylesX.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 32,
  },
});

const stylesX = {
  container:
    Platform.OS === "web" ? ({ position: "fixed" } as SxProp) : undefined,
  modal:
    Platform.OS === "web"
      ? ({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        } as SxProp)
      : undefined,
  content: { overflowY: "scroll" } as SxProp,
};
