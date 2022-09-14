import { memo, forwardRef, useImperativeHandle } from "react";

import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalScreenProps } from "./types";

const ModalScreenComponent = forwardRef<any, ModalScreenProps>(
  function ModalScreenComponent({ title, children, onClose }, ref) {
    useImperativeHandle(ref, () => {});
    return (
      <>
        <ModalHeaderBar />
        <ModalHeader title={title} onClose={onClose} />
        {children}
      </>
    );
  }
);

export const ModalScreen = memo(ModalScreenComponent);
