import type { FC, ReactNode } from "react";

import type {
  BottomSheetProps,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";

import type { TW } from "../tailwind/types";

export interface ModalMethods {
  close: () => void;
}

export interface ModalProps {
  /**
   * Defines the modal title.
   * @default ""
   */
  title?: string;
  /**
   * Defines if the modal is presenting as
   * a screen.
   * @default false
   */
  isScreen?: boolean;
  /**
   * **MOBILE ONLY**: Defines the points for the bottom sheet
   * to snap to. It accepts array of number, string or mix.
   * @default ["50%"]
   */
  mobile_snapPoints?: BottomSheetProps["snapPoints"];

  /**
   * **WEB ONLY**: Defines the modal container height.
   * It could be static value or responsive.
   * @default "max-h-280px"
   */
  web_height?: string;

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

  //#region callbacks
  /**
   * Defines the action to close
   * the modal view/screen.
   * @default undefined
   */
  onClose?: () => void;
  //#endregion
}

export interface ModalHeaderProps
  extends Pick<ModalProps, "title" | "onClose"> {
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
}

export interface ModalContainerProps
  extends Pick<
    ModalProps,
    | "title"
    | "isScreen"
    | "onClose"
    | "children"
    | "mobile_snapPoints"
    | "web_height"
  > {
  close: () => void;
}

export interface ModalScreenProps extends ModalProps {
  close: () => void;
}

export interface ModalFooterProps {
  children: JSX.Element;
}

export interface ModalBackdropProps extends Pick<ModalProps, "onClose"> {}
