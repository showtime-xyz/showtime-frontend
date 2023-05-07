import { FC, useCallback, useRef, useState, useMemo } from "react";

import { ModalScreen } from "@showtime-xyz/universal.modal";
import type { ModalMethods } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";

import { ModalScreenContext } from "./modal-screen-context";
import type { ModalScreenOptions } from "./types";
import { useBackPressHandler } from "./use-back-press-handler";

function withModalScreen<P extends {}>(
  Screen: FC<P>,
  {
    title: titleProp,
    snapPoints = ["90%", "100%"],
    backPressHandlerEnabled = true,
    ...rest
  }: ModalScreenOptions
) {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const [title, setTitle] = useState(titleProp);
    const modalRef = useRef<ModalMethods>(null);
    useBackPressHandler(modalRef, backPressHandlerEnabled);

    const router = useRouter();
    const onClose = useCallback(() => {
      router.pop();
    }, [router]);

    const contextValues = useMemo(() => ({ setTitle }), []);

    return (
      <ModalScreenContext.Provider value={contextValues}>
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
      </ModalScreenContext.Provider>
    );
  };
}

export { withModalScreen };
