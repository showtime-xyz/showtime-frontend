import type { FC, ReactNode } from "react";

import type { BottomSheetProps } from "@gorhom/bottom-sheet";

import type { TW } from "../tailwind/types";

export interface ModalProps
  extends Partial<Pick<BottomSheetProps, "snapPoints">> {
  /**
   * Defines the modal title.
   * @default ""
   */
  title?: string;
  /**
   * Defines the modal presentation type.
   * @default false
   */
  isScreen?: boolean;

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
  extends Pick<ModalProps, "isScreen" | "onClose" | "children" | "snapPoints"> {
  headerComponent?: FC<any>;
}
