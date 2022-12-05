import { useCallback } from "react";
import { StyleProp, useWindowDimensions, ViewStyle } from "react-native";

import { BottomSheetHandleProps, BottomSheetProps } from "@gorhom/bottom-sheet";

import { BottomSheet } from "@showtime-xyz/universal.bottom-sheet";
import {
  Modal,
  ModalHeader,
  ModalProps,
  ModalHeaderBar,
} from "@showtime-xyz/universal.modal";

export type ModalSheetProps = Pick<ModalProps, "web_height"> & {
  children: React.ReactElement;
  title?: string;
  visible?: boolean;
  close?: () => void;
  onClose?: () => void;
  snapPoints?: BottomSheetProps["snapPoints"];
  bodyStyle?: StyleProp<ViewStyle>;
};

export function ModalSheet({
  visible = true,
  title,
  close,
  onClose,
  snapPoints,
  children,
  ...rest
}: ModalSheetProps) {
  const { width } = useWindowDimensions();

  const renderHandleComponent: React.FC<BottomSheetHandleProps> = useCallback(
    (handleProps) => (
      <>
        <ModalHeaderBar />
        <ModalHeader title={title} onClose={close} {...handleProps} />
      </>
    ),
    [title, close]
  );

  if (width >= 768) {
    return visible ? (
      <Modal
        key={`modalsheet-${title}-lg`}
        title={title}
        onClose={() => {
          // TODO: extract `onClose` to a proper unmount transition completion event.
          close?.();
          onClose?.();
        }}
        {...rest}
      >
        {children}
      </Modal>
    ) : null;
  }

  return (
    <BottomSheet
      key={`modalsheet-${title}-sm`}
      visible={visible}
      handleComponent={renderHandleComponent}
      onDismiss={onClose}
      snapPoints={snapPoints}
      {...rest}
    >
      {children}
    </BottomSheet>
  );
}
