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
import type { ModalContainerProps } from "./types";

function ModalContainerComponent({
  isScreen,
  snapPoints,
  onClose,
  headerComponent,
  children,
}: ModalContainerProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const backgroundStyle = useMemo(
    () => tailwind.style("bg-white dark:bg-black rounded-t-[32px]"),
    []
  );

  //#region effects
  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);
  //#endregion

  //#region render
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={tailwind.style("bg-gray-100 dark:bg-gray-900")}
        {...props}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints!}
      backgroundStyle={backgroundStyle}
      onDismiss={onClose}
      handleComponent={headerComponent}
      backdropComponent={renderBackdrop}
    >
      {children}
    </BottomSheetModal>
  );
}

export const ModalContainer = memo(ModalContainerComponent);
