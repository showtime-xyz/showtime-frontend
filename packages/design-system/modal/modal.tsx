import { forwardRef, memo, useCallback, useRef } from "react";

import { MOBILE_SNAP_POINTS, WEB_HEIGHT } from "./constants";
import { ModalContainer as BaseModalContainer } from "./modal.container";
import { ModalMethods, ModalProps } from "./types";

const ModalComponent = forwardRef<ModalMethods, ModalProps>(
  function ModalComponent(
    {
      title,
      isScreen = false,
      web_height = WEB_HEIGHT,
      disableBackdropPress,
      mobile_snapPoints = MOBILE_SNAP_POINTS,
      modalContainer: ModalContainer = BaseModalContainer,
      children,
      onClose,
      ...rest
    },
    ref
  ) {
    const didFireClose = useRef(false);

    //#region methods
    const handleOnClose = useCallback(() => {
      if (didFireClose.current) {
        return;
      }
      didFireClose.current = true;
      onClose?.();
    }, [onClose]);

    const handleClose = useCallback(() => {
      if (!isScreen) {
        handleOnClose();
        //@ts-ignore
      } else if (isScreen && ref && ref.current) {
        //@ts-ignore
        ref.current.close();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScreen, handleOnClose]);
    //#endregion

    //#region render
    return (
      <ModalContainer
        ref={ref}
        title={title}
        isScreen={isScreen}
        web_height={web_height}
        mobile_snapPoints={mobile_snapPoints}
        close={handleClose}
        onClose={handleOnClose}
        disableBackdropPress={disableBackdropPress}
        {...rest}
      >
        {children}
      </ModalContainer>
    );
    //#endregion
  }
);

export const Modal = memo(ModalComponent);
