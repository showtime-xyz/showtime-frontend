import { Modal } from "design-system/modal";

import { ModalSheetProps } from ".";

export function ModalSheet({
  visible = true,
  title,
  close,
  onClose,
  snapPoints,
  children,
  ...rest
}: ModalSheetProps) {
  return visible ? (
    <Modal
      key={`modalsheet-${title}`}
      title={title}
      mobile_snapPoints={snapPoints}
      onClose={() => {
        // TODO: extract `onClose` to a proper unmount transition completion event.
        close?.();
        onClose?.();
      }}
      {...rest}
    >
      {children}
    </Modal>
  ) : null;
}
