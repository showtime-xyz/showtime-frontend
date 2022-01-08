import { useCallback, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Modal } from "@showtime/universal-ui.modal";
import { BottomSheet } from "@showtime/universal-ui.bottom-sheet";
import { Header } from "@showtime/universal-ui.modal";

type Props = {
  children: React.ReactElement;
  title?: string;
  visible?: boolean;
  close?: () => void;
  onClose?: () => void;
};

export function ModalSheet({ visible = true, ...props }: Props) {
  const { width } = useWindowDimensions();

  const renderHandleComponent = useCallback(
    (handleProps) => (
      <Header title={props.title} close={props.close} {...handleProps} />
    ),
    [props.title, props.close]
  );

  if (width >= 1024) {
    return visible ? (
      <Modal
        key={`modalsheet-${props.title}-lg`}
        title={props.title}
        close={() => {
          // TODO: extract `onClose` to a proper unmount transition completion event.
          props.close();
          props.onClose();
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
    >
      {props.children}
    </BottomSheet>
  );
}
