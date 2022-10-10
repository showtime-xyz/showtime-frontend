import { memo, forwardRef } from "react";

import { Modal } from "./modal";
import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalProps } from "./types";

const ModalScreenComponent = forwardRef<any, ModalProps>(
  function ModalScreenComponent(
    { title, children, onClose, useNativeModal = true, ...rest },
    ref
  ) {
    if (useNativeModal) {
      return (
        <>
          <ModalHeaderBar />
          <ModalHeader title={title} onClose={onClose} />
          {children}
        </>
      );
    }
    return (
      <Modal ref={ref} title={title} onClose={onClose} {...rest}>
        {children}
      </Modal>
    );
  }
);

export const ModalScreen = memo(ModalScreenComponent);
