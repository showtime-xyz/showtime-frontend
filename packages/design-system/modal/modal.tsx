import { forwardRef, memo, useCallback } from "react";

import debounce from "lodash/debounce";

import { MOBILE_SNAP_POINTS, WEB_HEIGHT } from "./constants";
import { ModalContainer as BaseModalContainer } from "./modal.container";
import type { ModalMethods, ModalProps } from "./types";

const ModalComponent = forwardRef<ModalMethods, ModalProps>(
  function ModalComponent(
    {
      title,
      subtitle,
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
    //#region methods
    const handleOnClose = useCallback(() => {
      onClose?.();
    }, [onClose]);
    const debounceHandleOnClose = debounce(handleOnClose, 300);

    const handleClose = useCallback(() => {
      if (!isScreen) {
        debounceHandleOnClose();
        //@ts-ignore
      } else if (isScreen && ref && ref.current) {
        //@ts-ignore
        ref.current.close();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScreen, debounceHandleOnClose]);
    //#endregion

    //#region render
    return (
      <ModalContainer
        ref={ref}
        title={title}
        subtitle={subtitle}
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
