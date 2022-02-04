import type React from "react";
import type { TW } from "../tailwind/types";

export interface ModalWrapperProps {
  tw?: TW;
}

export interface ModalProps {
  /**
   * Defines the modal content.
   */
  children: React.ReactNode;
  /**
   * Defines the modal wrapper.
   */
  modalWrapper?: React.FC<ModalWrapperProps> | null;
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
   * Defines the body tailwind style.
   *
   * @default undefined
   */
  bodyTW?: TW;
  /**
   * Defines the keyboard vertical offset, usually
   * the header height.
   *
   * @default 0
   */
  keyboardVerticalOffset?: number;
  /**
   * Defines the action to be fried to close
   * the modal.
   *
   * @default undefined
   */
  close?: () => void;
  /**
   * Defines the callback when the modal dismiss.
   *
   * @default undefined
   */
  onDismiss?: () => void;
}
