import { memo, useMemo, useEffect, useRef, useCallback } from "react";
import { StyleSheet } from "react-native";

import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";

import { useLockBodyScroll } from "@showtime-xyz/universal.hooks";
import { View } from "@showtime-xyz/universal.view";

import { WEB_HEIGHT } from "./constants";
import { ModalBackdrop } from "./modal.backdrop";
import { ModalHeader } from "./modal.header";
import type { ModalContainerProps } from "./types";

const CONTAINER_TW = [
  "top-0 right-0 bottom-0 left-0",
  "flex items-center justify-end sm:justify-center",
];

const MODAL_CONTAINER_TW = [
  "flex overflow-hidden justify-center",
  "w-full	sm:w-[480px]",
  "bg-white dark:bg-black",
  "dark:shadow-lg-dark shadow-lg-light",
  "rounded-t-[32px] rounded-b-0 sm:rounded-b-[32px] pb-4",
  "max-h-[90vh] md:max-h-[82vh]",
];

const MODAL_BODY_TW = "flex-1 overflow-auto";

const noop = () => {};

function ModalContainerComponent({
  title,
  web_height = WEB_HEIGHT,
  onClose,
  children,
  bodyStyle,
  style,
  disableBackdropPress,
  tw: propTw = "",
}: ModalContainerProps) {
  const modalContainerTW = useMemo(
    () => [...MODAL_CONTAINER_TW, web_height, propTw],
    [web_height, propTw]
  );

  useEscapeKeydown((event) => {
    event.preventDefault();

    return disableBackdropPress ? noop() : onClose?.();
  });

  // Prevent scrolling the body when the modal is open
  useLockBodyScroll();

  return (
    <FocusTrap aria-modal>
      <View tw={CONTAINER_TW} style={styles.container}>
        <ModalBackdrop onClose={disableBackdropPress ? noop : onClose} />
        <View tw={modalContainerTW} style={style}>
          <ModalHeader title={title} onClose={onClose} />
          <View tw={MODAL_BODY_TW} style={bodyStyle} accessibilityViewIsModal>
            {children}
          </View>
        </View>
      </View>
    </FocusTrap>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "fixed" as any,
    zIndex: 999,
  },
});

export function FocusTrap(props: JSX.IntrinsicElements["div"]) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyActiveElement = document.activeElement;

    return () => {
      (previouslyActiveElement as HTMLElement).focus?.();
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus({
        preventScroll: true,
      });
    }
  }, [contentRef]);

  const onStartNodeFocus = useCallback(
    () => contentRef.current && moveFocusWithin(contentRef.current, "end"),
    []
  );

  const onEndNodeFocus = useCallback(
    () => contentRef.current && moveFocusWithin(contentRef.current, "start"),
    []
  );

  return (
    <>
      <div onFocus={onStartNodeFocus} tabIndex={0} />
      <div
        ref={contentRef}
        style={{ outline: "none" }}
        tabIndex={-1}
        {...props}
      />
      <div onFocus={onEndNodeFocus} tabIndex={0} />
    </>
  );
}

const moveFocusWithin = (element: HTMLElement, position: "start" | "end") => {
  const focusableElements = element.querySelectorAll(
    `button:not(:disabled), [tabindex = "0"], a[href]`
  ) as NodeListOf<HTMLButtonElement | HTMLAnchorElement>;

  if (focusableElements.length === 0) return;

  focusableElements[
    position === "end" ? focusableElements.length - 1 : 0
  ].focus();
};

export const ModalContainer = memo(ModalContainerComponent);
