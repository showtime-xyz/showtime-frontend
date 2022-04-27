import { FC, useCallback, useRef } from "react";

import { useRouter } from "app/navigation/use-router";

import { ModalMethods } from "design-system/modal";
import { ModalScreen } from "design-system/modal/modal.screen";

import { useBackPressHandler } from "./use-back-press-handler";

const snapPoints = ["90%", "100%"];

function withModalScreen<P>(
  Screen: FC<P>,
  title: string,
  // eslint-disable-next-line no-unused-vars
  _?: string,
  // eslint-disable-next-line no-unused-vars
  __?: string
) {
  return function (props: P) {
    const modalRef = useRef<ModalMethods>(null);
    const { pop } = useRouter();

    const onClose = useCallback(() => {
      pop();
    }, [pop]);

    useBackPressHandler(modalRef);
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
