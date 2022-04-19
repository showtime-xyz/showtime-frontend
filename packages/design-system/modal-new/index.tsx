import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { SNAP_POINTS } from "./constants";
import { ModalContainer as BaseModalContainer } from "./modal.container";
import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalProps } from "./types";

function ModalComponent({
  title,
  isScreen = false,
  snapPoints = SNAP_POINTS,
  modalContainer: ModalContainer = BaseModalContainer,
  children,
  onClose,
}: ModalProps) {
  const didFireClose = useRef(false);

  //#region methods
  const handleClose = useCallback(() => {
    if (didFireClose.current) {
      return;
    }
    didFireClose.current = true;
    onClose?.();
  }, [onClose]);
  //#endregion

  //#region render
  const renderHeaderComponent = useCallback(
    (props) => (
      <>
        <ModalHeaderBar />
        <ModalHeader title={title} onClose={handleClose} {...props} />
      </>
    ),
    [title, handleClose]
  );
  return (
    <ModalContainer
      isScreen={isScreen}
      snapPoints={snapPoints}
      headerComponent={renderHeaderComponent}
      onClose={handleClose}
    >
      {children}
    </ModalContainer>
  );
  //#endregion
}

export const Modal = memo(ModalComponent);
