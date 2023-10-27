import {
  memo,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  Fragment,
} from "react";

import { Transition } from "@headlessui/react";

import { View } from "@showtime-xyz/universal.view";

import { WEB_HEIGHT } from "./constants";
import { ModalBackdrop } from "./modal.backdrop";
import { ModalHeader } from "./modal.header";
import type { ModalContainerProps, ModalMethods } from "./types";

const CONTAINER_TW = [
  "fixed z-[999] inset-0",
  "flex items-center justify-end sm:justify-center",
];

const MODAL_CONTAINER_TW = [
  "flex overflow-hidden justify-center",
  "w-full	sm:w-[480px]",
  "bg-white dark:bg-black",
  "rounded-t-[32px] rounded-b-0 sm:rounded-b-[32px] pb-4",
  "max-h-[90vh] md:max-h-[82vh]",
];

const MODAL_BODY_TW = "flex-1 overflow-auto";

const ModalContainerComponent = forwardRef<ModalMethods, ModalContainerProps>(
  function ModalContainerComponent(
    {
      title,
      subtitle,
      web_height = WEB_HEIGHT,
      onClose,
      close,
      children,
      bodyStyle,
      style,
      disableBackdropPress,
      tw: propTw = "",
      headerShown = true,
      visible = false,
      closeButtonProps,
    }: ModalContainerProps,
    ref
  ) {
    useImperativeHandle(
      ref,
      () => ({
        close,
        snapToIndex: () => {},
      }),
      [close]
    );

    return (
      <Transition.Root afterLeave={onClose} show={visible} as={Fragment}>
        <View className={CONTAINER_TW.join(" ")}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalBackdrop
              onClose={close}
              disableBackdropPress={disableBackdropPress}
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-250"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <View
              tw={[...MODAL_CONTAINER_TW, web_height, propTw]}
              style={style}
            >
              {headerShown && (
                <ModalHeader
                  title={title}
                  subtitle={subtitle}
                  onClose={close}
                  closeButtonProps={closeButtonProps}
                />
              )}
              <View
                tw={MODAL_BODY_TW}
                style={bodyStyle}
                accessibilityViewIsModal
              >
                {children}
              </View>
            </View>
          </Transition.Child>
        </View>
      </Transition.Root>
    );
  }
);

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
