import { memo, forwardRef } from "react";

import { Modal } from "./modal";
import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalProps } from "./types";

const ModalScreenComponent = forwardRef<any, ModalProps>(
  function ModalScreenComponent(
    {
      title,
      subtitle,
      children,
      onClose,
      useNativeModal = true,
      headerShown = true,
      enableHandlePanningGesture = true,
      closeButtonProps,
      ...rest
    },
    ref
  ) {
    if (useNativeModal) {
      return (
        <>
          {headerShown && (
            <>
              {enableHandlePanningGesture && <ModalHeaderBar />}
              <ModalHeader
                title={title}
                subtitle={subtitle}
                onClose={onClose}
                closeButtonProps={closeButtonProps}
              />
            </>
          )}

          {children}
        </>
      );
    }
    return (
      <Modal
        ref={ref}
        title={title}
        onClose={onClose}
        closeButtonProps={closeButtonProps}
        headerShown={headerShown}
        {...rest}
      >
        {children}
      </Modal>
    );
  }
);

export const ModalScreen = memo(ModalScreenComponent);
