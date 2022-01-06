import type React from "react";

export interface ModalProps {
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
   * Defines the body tailwind style.
   * 
   * @default undefined
   */
  bodyTW?: string;
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