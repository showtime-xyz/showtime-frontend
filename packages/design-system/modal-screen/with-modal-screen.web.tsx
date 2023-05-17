import { FC, useCallback, useRef, useMemo, useState, useEffect } from "react";

import { Modal } from "@showtime-xyz/universal.modal";
import type { ModalMethods } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";

import { ModalScreenContext } from "./modal-screen-context";
import type { ModalScreenOptions } from "./types";

function withModalScreen<P extends object>(
  Screen: FC<P>,
  {
    title: titleProp,
    matchingPathname,
    matchingQueryParam,
    ...rest
  }: ModalScreenOptions
) {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const [title, setTitle] = useState(titleProp);
    const [visible, setVisible] = useState(false);
    const isLayouted = useRef(false);
    const modalRef = useRef<ModalMethods>(null);
    const router = useRouter();

    const closeModal = useCallback(() => {
      setVisible(false);
    }, []);

    const onClose = useCallback(() => {
      if (
        router.asPath === "/login" ||
        router.asPath === "/create" ||
        router.asPath === "/drop/free" ||
        router.asPath === "/drop/music" ||
        router.asPath === "/drop" ||
        router.asPath === "/"
      ) {
        router.push("/");
      } else {
        router.pop();
      }
      isLayouted.current = false;
    }, [router]);

    useEffect(() => {
      setTitle(titleProp);
    }, []);
    useEffect(() => {
      if (
        !isLayouted.current &&
        (router.pathname === matchingPathname ||
          Boolean(router.query[matchingQueryParam as any]))
      ) {
        isLayouted.current = true;
        setVisible(true);
      }
    }, [router]);

    const contextValues = useMemo(() => ({ setTitle }), []);
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
