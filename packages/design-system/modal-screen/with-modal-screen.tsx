import { FC, useCallback, useRef } from "react";

import { useRouter } from "app/navigation/use-router";

import { ModalMethods } from "design-system/modal";
import { ModalScreen } from "design-system/modal/modal.screen";

import type { ModalScreenOptions } from "./types";
import { useBackPressHandler } from "./use-back-press-handler";

function withModalScreen<P>(
  Screen: FC<P>,
  { title, snapPoints = ["90%", "100%"] }: ModalScreenOptions
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
      <ModalScreen
        ref={modalRef}
        title={title}
        mobile_snapPoints={snapPoints}
        isScreen={true}
        onClose={onClose}
      >
        <Screen {...props} />
      </ModalScreen>
    );
  };
}

export { withModalScreen };
