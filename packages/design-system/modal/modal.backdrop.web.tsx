import { memo } from "react";

import { View } from "@showtime-xyz/universal.view";

import type { ModalBackdropProps } from "./types";

const BACKDROP_TW = [
  "absolute top-0 right-0 bottom-0 left-0",
  "opacity-95 dark:opacity-85",
  "bg-gray-100 dark:bg-gray-900",
];

function ModalBackdropComponent({ onClose }: ModalBackdropProps) {
  return (
    <View
      tw={BACKDROP_TW}
      // @ts-ignore
      onClick={onClose}
      onTouchEnd={onClose}
    />
  );
}

export const ModalBackdrop = memo(ModalBackdropComponent);
