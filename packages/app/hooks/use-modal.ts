import { useCallback, useRef } from "react";
import { Platform } from "react-native";

import { useIsFocused } from "app/lib/react-navigation/native";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";

const snapPoints = ["90%"];

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
export const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

// TODO: remove this and replace with modalScreen HOC
export const useModal = () => {
  const wasClosedByUserAction = useRef<boolean | undefined>(undefined);
  const isModalFocused = useIsFocused();
  const router = useRouter();
  const { top: topSafeArea } = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    wasClosedByUserAction.current = true;
    router.pop();
  }, [router]);

  const handleOnClose = useCallback(() => {
    if (!isModalFocused) {
      return;
    }

    if (!wasClosedByUserAction.current) {
      wasClosedByUserAction.current = true;
      router.pop();
    }
  }, [router, isModalFocused]);

  const ModalComponent = Platform.OS === "android" ? ModalSheet : Modal;

  return [
    ModalComponent,
    {
      snapPoints,
      height: "h-[90vh]",
      close: handleClose,
      onClose: handleOnClose,
      keyboardVerticalOffset: topSafeArea + modalPresentationHeight,
      bodyTW: "bg-white dark:bg-black",
      bodyContentTW: "p-0",
      scrollable: false,
      visible: isModalFocused,
    },
  ];
};
