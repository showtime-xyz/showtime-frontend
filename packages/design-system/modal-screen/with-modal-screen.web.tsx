import { FC, useCallback, useRef, useState, useEffect } from "react";

import { useIsomorphicLayoutEffect } from "@showtime-xyz/universal.hooks";
import { Modal } from "@showtime-xyz/universal.modal";
import type { ModalMethods } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";

import { ModalScreenContext } from "./modal-screen-context";
import type {
  ModalScreenContextValue,
  ModalScreenOptions,
  PopCallback,
} from "./types";

function withModalScreen<P extends object>(
  Screen: FC<P>,
  {
    title: titleProp,
    matchingPathname,
    matchingQueryParam,
    onScreenDismiss,
    ...rest
  }: ModalScreenOptions
) {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const [title, setTitle] = useState(titleProp);
    const [visible, setVisible] = useState(false);
    const isLayouted = useRef(false);
    const closeCallback = useRef<PopCallback>(null);
    const modalRef = useRef<ModalMethods>(null);
    const router = useRouter();
    const [contextValues, setContextValues] = useState<ModalScreenContextValue>(
      {
        setTitle,
        pop: () => {},
        snapToIndex: () => {},
      }
    );
    const closeModal = useCallback(() => {
      setVisible(false);
    }, []);

    const onClose = useCallback(() => {
      if (!isLayouted.current) return;
      if (router.asPath === "/login" || router.asPath === "/") {
        router.push("/");
      } else {
        router.pop();
      }
      isLayouted.current = false;
      onScreenDismiss?.();
    }, [router]);

    useIsomorphicLayoutEffect(() => {
      if (modalRef.current?.close) {
        setContextValues({
          setTitle,
          pop: (params) => {
            closeCallback.current = params?.callback;
            modalRef.current?.close();
          },
          snapToIndex: (position: number) => {
            modalRef.current?.snapToIndex(position);
          },
        });
      }
    }, []);
    useEffect(() => {
      if (
        !isLayouted.current &&
        (router.pathname === matchingPathname ||
          Boolean(router.query[matchingQueryParam]))
      ) {
        isLayouted.current = true;
        setVisible(true);
      } else if (isLayouted.current && router.pathname !== matchingPathname) {
        isLayouted.current = false;
        setVisible(false);
      }
    }, [router.pathname, router.query]);

    return (
      <ModalScreenContext.Provider value={contextValues}>
        <Modal
          ref={modalRef}
          title={title}
          visible={visible}
          onClose={onClose}
          close={closeModal}
          {...rest}
        >
          <Screen {...props} />
        </Modal>
      </ModalScreenContext.Provider>
    );
  };
}

export { withModalScreen };
