import { memo } from "react";

import { View } from "../view";
import type { ModalBackdropProps } from "./types";

function ModalBackdropComponent({ onClose }: ModalBackdropProps) {
  return (
    <View
      tw="absolute top-0 right-0 bottom-0 left-0 opacity-95 dark:opacity-85 bg-gray-100 dark:bg-gray-900"
      // @ts-ignore
      onClick={onClose}
      onTouchEnd={onClose}
    />
  );
}

export const ModalBackdrop = memo(ModalBackdropComponent);
