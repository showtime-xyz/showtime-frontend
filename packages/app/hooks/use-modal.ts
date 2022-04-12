import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { modalPresentationHeight } from "app/constants/modal";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";
import { useIsTabFocused } from "design-system/tabs/tablib";

const snapPoints = ["90%"];

export const useModal = () => {
  const wasClosedByUserAction = useRef<boolean | undefined>(undefined);
  const isModalFocused = useIsTabFocused();
  const router = useRouter();
  const { top: topSafeArea } = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    wasClosedByUserAction.current = true;
    router.back();
  }, [router]);

  const handleOnClose = useCallback(() => {
    if (!isModalFocused) {
      return;
    }

    if (!wasClosedByUserAction.current) {
      wasClosedByUserAction.current = true;
      router.back();
    }
  }, [router, isModalFocused]);

  const ModalComponent = Platform.OS === "android" ? ModalSheet : Modal;
  useEffect(() => {}, []);

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
