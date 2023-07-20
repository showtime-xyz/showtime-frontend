import { memo, forwardRef, useCallback } from "react";

import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";

import { useLockHtmlScroll } from "@showtime-xyz/universal.hooks";

import type { ModalBackdropProps } from "./types";

const BACKDROP_TW = [
  "absolute top-0 right-0 bottom-0 left-0",
  "opacity-90",
  "bg-gray-900 dark:bg-gray-800",
  "transition-opacity",
];
const noop = () => {};

const ModalBackdropComponent = forwardRef<any, ModalBackdropProps>(
  function ModalBackdropComponent({ onClose, disableBackdropPress }, ref) {
    const onCloseMethod = useCallback(() => {
      disableBackdropPress ? noop() : onClose?.();
    }, [disableBackdropPress, onClose]);

    useEscapeKeydown((event) => {
      event.preventDefault();
      return onCloseMethod();
    });
    useLockHtmlScroll();
    return (
      <div
        ref={ref}
        className={BACKDROP_TW.join(" ")}
        onClick={onCloseMethod}
        onTouchEnd={onClose}
      />
    );
  }
);

export const ModalBackdrop = memo(ModalBackdropComponent);
