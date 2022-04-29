import { forwardRef, memo } from "react";

import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalScreenProps } from "./types";

const ModalScreenComponent = forwardRef(function ModalScreenComponent(
  { title, children, onClose }: ModalScreenProps,
  ref
) {
  return (
    <>
      <ModalHeaderBar />
      <ModalHeader title={title} onClose={onClose} />
      {children}
    </>
  );
});

export const ModalScreen = memo(ModalScreenComponent);
