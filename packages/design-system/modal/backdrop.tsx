import { View } from "../view";

export type ModalBackdropProps = {
  close?: () => void;
};

export function ModalBackdrop({ close }: ModalBackdropProps) {
  return (
    <View
      tw="absolute top-0 right-0 bottom-0 left-0 opacity-95 dark:opacity-85 bg-gray-100 dark:bg-gray-900"
      // @ts-ignore
      onClick={close}
      onTouchEnd={close}
    />
  );
}
