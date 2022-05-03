import { useCallback } from "react";
import { useWindowDimensions } from "react-native";

import { BottomSheetHandleProps } from "@gorhom/bottom-sheet";

import { BottomSheet } from "../bottom-sheet";
import { Modal } from "../modal";
import { ModalHeader } from "../modal/modal.header";

type Props = {
  children: React.ReactElement;
  title?: string;
  visible?: boolean;
  close?: () => void;
  onClose?: () => void;
  snapPoints?: string[];
  bodyContentTW?: string;
};

export function ModalSheet({ visible = true, bodyContentTW, ...props }: Props) {
  const { width } = useWindowDimensions();

  const renderHandleComponent: React.FC<BottomSheetHandleProps> = useCallback(
    (handleProps) => (
      <ModalHeader title={props.title} onClose={props.close} {...handleProps} />
    ),
    [props.title, props.close]
  );

  if (width >= 768) {
    return visible ? (
      <Modal
        key={`modalsheet-${props.title}-lg`}
        title={props.title}
        onClose={() => {
          // TODO: extract `onClose` to a proper unmount transition completion event.
          props.close?.();
          props.onClose?.();
        }}
      >
        {props.children}
      </Modal>
    ) : null;
  }

  return (
    <BottomSheet
      key={`modalsheet-${props.title}-sm`}
      visible={visible}
      handleComponent={renderHandleComponent}
      onDismiss={props.onClose}
      snapPoints={props.snapPoints}
      bodyContentTW={bodyContentTW}
    >
      {props.children}
    </BottomSheet>
  );
}
