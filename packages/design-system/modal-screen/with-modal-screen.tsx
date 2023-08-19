import { FC, useCallback, useRef, useState, useLayoutEffect } from "react";

import { ModalScreen } from "@showtime-xyz/universal.modal";
import type { ModalMethods } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";

import { ModalScreenContext } from "./modal-screen-context";
import type {
  ModalScreenContextValue,
  ModalScreenOptions,
  PopCallback,
} from "./types";
import { useBackPressHandler } from "./use-back-press-handler";

function withModalScreen<P extends {}>(
  Screen: FC<P>,
  {
    title: titleProp,
    subtitle: subtitleProp,
    snapPoints = ["90%", "100%"],
    backPressHandlerEnabled = true,
    onScreenDismiss,
    ...rest
  }: ModalScreenOptions
) {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const [title, setTitle] = useState(titleProp);
    const [subtitle, setSubtitle] = useState(subtitleProp);
    const closeCallback = useRef<PopCallback>(null);

    const [contextValues, setContextValues] = useState<ModalScreenContextValue>(
      {
        setTitle,
        setSubtitle,
        pop: () => {},
        snapToIndex: () => {},
      }
    );
    const modalRef = useRef<ModalMethods>(null);
    useBackPressHandler(modalRef, backPressHandlerEnabled);

    const router = useRouter();
    const onClose = useCallback(() => {
      router.pop();
      closeCallback.current?.();
      onScreenDismiss?.();
    }, [router]);

    useLayoutEffect(() => {
      if (modalRef.current?.close) {
        setContextValues({
          setTitle,
          setSubtitle,
          pop: (params) => {
            closeCallback.current = params?.callback;
            modalRef.current?.close();
          },
          snapToIndex: (position: number) => {
            modalRef.current?.snapToIndex(position);
          },
        });
      }
    }, [router]);

    return (
      <ModalScreenContext.Provider value={contextValues}>
        <ModalScreen
          ref={modalRef}
          title={title}
          subtitle={subtitle}
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
