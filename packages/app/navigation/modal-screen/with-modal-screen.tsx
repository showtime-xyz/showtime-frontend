import React, { FC, useCallback, useRef } from "react";

import { ModalMethods } from "design-system/modal-new";
import { ModalScreen } from "design-system/modal-new/modal.screen";

import { useRouter } from "../use-router";
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
