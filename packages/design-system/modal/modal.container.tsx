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
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tw as tailwind } from "../tailwind";
import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import { ModalContainerProps, ModalMethods } from "./types";
// @ts-ignore
import { useKeyboard } from "./useKeyboard";

const BACKGROUND_TW = [
  "bg-white dark:bg-black",
  "rounded-t-[32px]",
  "pointer-events-auto",
];

const BACKDROP_TW = "bg-gray-100 dark:bg-gray-900";

const ModalContainerComponent = forwardRef<ModalMethods, ModalContainerProps>(
  function ModalContainerComponent(
    { title, mobile_snapPoints, isScreen, close, onClose, children },
    ref
  ) {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const { top } = useSafeAreaInsets();

    const backgroundStyle = useMemo(() => tailwind.style(...BACKGROUND_TW), []);
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
    }));
    //#endregion

    //#region render
    const renderBackdropComponent = useCallback(
      (props) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          style={tailwind.style(BACKDROP_TW)}
          {...props}
        />
      ),
      []
    );
    const renderHandleComponent = useCallback(
      (props) => (
        <>
          <ModalHeaderBar />
          <ModalHeader title={title} onClose={close} {...props} />
        </>
      ),
      [title, close]
    );
    return (
      <ModalSheet
        ref={bottomSheetRef as any}
        index={0}
        topInset={top}
        snapPoints={mobile_snapPoints!}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustPan"
        keyboardBlurBehavior="restore"
        backgroundStyle={backgroundStyle}
        enablePanDownToClose={true}
        handleComponent={renderHandleComponent}
        backdropComponent={renderBackdropComponent}
        // @ts-ignore
        keyboardHandlerHook={useKeyboard}
        onClose={onClose}
        onDismiss={onClose}
      >
        {children}
      </ModalSheet>
    );
  }
);

export const ModalContainer = memo(ModalContainerComponent);
