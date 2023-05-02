import { Modal } from "@showtime-xyz/universal.modal";

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
  return (
    <Modal
      key={`modalsheet-${title}`}
      title={title}
      mobile_snapPoints={snapPoints}
      onClose={() => {
        // TODO: extract `onClose` to a proper unmount transition completion event.
        close?.();
        onClose?.();
      }}
      visible={visible}
      {...rest}
    >
      {children}
    </Modal>
  );
}
