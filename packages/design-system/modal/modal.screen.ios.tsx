import { memo } from "react";

import { ModalHeader } from "./modal.header";
import { ModalHeaderBar } from "./modal.header-bar";
import type { ModalScreenProps } from "./types";

const ModalScreenComponent = ({
  title,
  children,
  onClose,
}: ModalScreenProps) => {
  return (
    <>
      <ModalHeaderBar />
      <ModalHeader title={title} onClose={onClose} />
      {children}
    </>
  );
};

export const ModalScreen = memo(ModalScreenComponent);
