import { FC, useCallback, useRef } from "react";

import { ModalMethods, ModalScreen } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";
import { ToastProvider } from "@showtime-xyz/universal.toast";

import type { ModalScreenOptions } from "./types";
import { useBackPressHandler } from "./use-back-press-handler";

function withModalScreen<P>(
  Screen: FC<P>,
  { title, snapPoints = ["90%", "100%"], ...rest }: ModalScreenOptions
) {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const modalRef = useRef<ModalMethods>(null);
    useBackPressHandler(modalRef);

    const router = useRouter();
    const onClose = useCallback(() => {
      router.pop();
    }, [router]);

    return (
      // Toast provider so we toast shows up on top of modal overlay
      // TODO: use FullWindowOverlay or Portal instead of Portal
      <ToastProvider>
        <ModalScreen
          ref={modalRef}
          title={title}
          mobile_snapPoints={snapPoints}
          isScreen={true}
          onClose={onClose}
          {...rest}
        >
          <Screen {...props} />
        </ModalScreen>
      </ToastProvider>
    );
  };
}

export { withModalScreen };
