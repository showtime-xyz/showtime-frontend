import type { FC, ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import type { BottomSheetProps as GorhomBottomSheetProps } from "@showtime-xyz/universal.bottom-sheet";
import { ButtonProps } from "@showtime-xyz/universal.button";
import type { TW } from "@showtime-xyz/universal.tailwind";

export interface ModalMethods {
  close: () => void;
  snapToIndex: (index: number) => void;
}

export type ModalProps = Pick<ModalHeaderProps, "closeButtonProps"> & {
  /**
   * Defines the modal title.
   * @default ""
   */
  title?: string;
  /**
   * Defines the modal subtitle.
   * @default ""
   */
  subtitle?: string;
  /**
   * Defines if the modal is presenting as
   * a screen.
   * @default false
   */
  isScreen?: boolean;
  /**
   * **MOBILE ONLY**: Defines the points for the bottom sheet
   * to snap to. It accepts array of number, string or mix.
   * @default ["90%", "100%"]
   */
  mobile_snapPoints?: GorhomBottomSheetProps["snapPoints"];

  /**
   * **WEB ONLY**: Defines the modal container height.
   * It could be static value or responsive.
   * @default "max-h-[85vh] web:max-h-[99svh] md:max-h-[82vh]"
   */
  web_height?: string;
  /**
   * **WEB ONLY**: Whether to show the modal.
   * @default true
   */
  visible?: boolean;
  /**
   * Defines the modal container
   * tailwind style.
   * @default undefined
   */
  tw?: string;

  //#region components
  modalContainer?: FC<ModalContainerProps>;
  /**
   * Defines the modal content.
   * @default undefined
   */
  children?: ReactNode;
  //#endregion
  /**
   * Defines the modal to close method
   * @default undefined
   */
  close?: () => void;
  //#region callbacks
  /**
   * Defines the action to close
   * the modal view/screen.
   * @default undefined
   */
  onClose?: () => void;
  //#endregion
  /**
   * **WEB ONLY**: modal body style
   */
  bodyStyle?: StyleProp<ViewStyle>;
  /**
   * **WEB ONLY**: modal style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * **ANDROID ONLY ** BottomSheet's props
   * Enable content panning gesture interaction.
   * @type boolean
   * @default true
   */
  enableContentPanningGesture?: boolean;
  /**
   * **ANDROID ONLY ** BottomSheet's props
   * Enable handle panning gesture interaction.
   * @type boolean
   * @default true
   */
  enableHandlePanningGesture?: boolean;
  /**
   * **WEB ONLY ** prevents modal close on backdrop press
   * @type boolean
   * @default false
   */
  disableBackdropPress?: boolean;
  /**
   * **iOS ONLY**: use native modal
   * @default true
   */
  useNativeModal?: boolean;
  /**
   * Whether to show the header.
   * @default true
   */
  headerShown?: boolean;
};

export interface ModalHeaderProps
  extends Pick<ModalProps, "title" | "onClose" | "subtitle"> {
  /**
   * Defines the component to be placed
   * at the start of the header.
   * @default <Close /> button
   */
  startContentComponent?: FC<any>;
  /**
   * Defines the component to be placed
   * at the end of the header.
   * @default undefined
   */
  endContentComponent?: FC<any>;
  /**
   * Defines the header tailwind style.
   * @default undefined
   */
  tw?: TW;
  /**
   * header close button.
   * @default undefined
   */
  closeButtonProps?: ButtonProps;
}

export interface ModalContainerProps
  extends Pick<
    ModalProps,
    | "title"
    | "subtitle"
    | "isScreen"
    | "onClose"
    | "children"
    | "mobile_snapPoints"
    | "web_height"
    | "visible"
    | "style"
    | "closeButtonProps"
  > {
  close: () => void;
  bodyStyle?: StyleProp<ViewStyle>;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  headerShown?: boolean;
  disableBackdropPress?: boolean;
  tw?: string;
}

export interface ModalFooterProps {
  children: JSX.Element;
}

export interface ModalBackdropProps extends Pick<ModalProps, "onClose"> {
  disableBackdropPress?: boolean;
}
