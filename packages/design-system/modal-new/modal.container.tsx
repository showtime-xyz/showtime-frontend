import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { tw as tailwind } from "../tailwind";
import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalContainerProps } from "./types";

const BACKGROUND_TW = [
  "bg-white dark:bg-black",
  "rounded-t-[32px]",
  "pointer-events-auto",
];

const BACKDROP_TW = "bg-gray-100 dark:bg-gray-900";

function ModalContainerComponent({
  title,
  mobile_snapPoints,
  onClose,
  children,
}: ModalContainerProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const backgroundStyle = useMemo(() => tailwind.style(...BACKGROUND_TW), []);

  //#region effects
  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);
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
        <ModalHeader title={title} onClose={onClose} {...props} />
      </>
    ),
    [title, onClose]
  );
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={mobile_snapPoints!}
      backgroundStyle={backgroundStyle}
      onDismiss={onClose}
      handleComponent={renderHandleComponent}
      backdropComponent={renderBackdropComponent}
    >
      {children}
    </BottomSheetModal>
  );
}

export const ModalContainer = memo(ModalContainerComponent);
