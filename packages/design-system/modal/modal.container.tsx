import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetHandleProps,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";

import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalContainerProps, ModalMethods } from "./types";

// @ts-ignore

const ModalContainerComponent = forwardRef<ModalMethods, ModalContainerProps>(
  function ModalContainerComponent(
    {
      title,
      subtitle,
      mobile_snapPoints,
      isScreen,
      close,
      onClose,
      children,
      enableContentPanningGesture = true,
      enableHandlePanningGesture = true,
      headerShown = true,
      closeButtonProps,
    },
    ref
  ) {
    const isDark = useIsDarkMode();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { top } = useSafeAreaInsets();

    const backgroundStyle = useMemo(
      () => ({
        backgroundColor: isDark ? "#000" : "#FFF",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        pointerEvents: "auto",
      }),
      [isDark]
    );
    const ModalSheet = useMemo(
      () => (isScreen ? BottomSheet : BottomSheetModal),
      [isScreen]
    );

    //#region effects
    useEffect(() => {
      if (!isScreen) {
        // @ts-ignore
        bottomSheetRef.current?.present();
      }
    }, [isScreen]);
    useImperativeHandle(ref, () => ({
      close: () => bottomSheetRef.current?.close(),
      snapToIndex: (index: number) =>
        bottomSheetRef.current?.snapToIndex(index),
    }));
    //#endregion

    //#region render
    const renderBackdropComponent = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          style={{
            backgroundColor: isDark ? colors.gray[900] : colors.gray[100],
          }}
          {...props}
        />
      ),
      [isDark]
    );

    const renderHandleComponent = useCallback(
      (props: BottomSheetHandleProps) => {
        return headerShown ? (
          <>
            {enableHandlePanningGesture && <ModalHeaderBar />}
            <ModalHeader
              title={title}
              subtitle={subtitle}
              onClose={close}
              closeButtonProps={closeButtonProps}
              {...props}
            />
          </>
        ) : null;
      },
      [
        title,
        close,
        headerShown,
        enableHandlePanningGesture,
        closeButtonProps,
        subtitle,
      ]
    );

    return (
      <ModalSheet
        ref={bottomSheetRef as any}
        index={0}
        topInset={top}
        snapPoints={mobile_snapPoints!}
        backgroundStyle={backgroundStyle}
        enablePanDownToClose={true}
        handleComponent={renderHandleComponent}
        backdropComponent={renderBackdropComponent}
        onClose={onClose}
        onDismiss={onClose}
        enableContentPanningGesture={enableContentPanningGesture}
        enableHandlePanningGesture={enableHandlePanningGesture}
      >
        {children}
      </ModalSheet>
    );
  }
);

export const ModalContainer = memo(ModalContainerComponent);
