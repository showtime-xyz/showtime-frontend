import { memo, useCallback, useRef } from "react";

import { MOBILE_SNAP_POINTS, WEB_HEIGHT } from "./constants";
import { ModalContainer as BaseModalContainer } from "./modal.container";
import type { ModalProps } from "./types";

function ModalComponent({
  title,
  isScreen = false,
  web_height = WEB_HEIGHT,
  mobile_snapPoints = MOBILE_SNAP_POINTS,
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
  return (
    <ModalContainer
      title={title}
      isScreen={isScreen}
      web_height={web_height}
      mobile_snapPoints={mobile_snapPoints}
      onClose={handleClose}
    >
      {children}
    </ModalContainer>
  );
  //#endregion
}

export const Modal = memo(ModalComponent);
