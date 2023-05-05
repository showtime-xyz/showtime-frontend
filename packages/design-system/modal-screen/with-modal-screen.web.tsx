import { FC, useCallback, useRef, useMemo, useState, useEffect } from "react";

import { ModalMethods, Modal } from "@showtime-xyz/universal.modal";
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
    const modalRef = useRef<ModalMethods>(null);
    const router = useRouter();

    const onClose = useCallback(() => {
      if (
        router.asPath === "/login" ||
        router.asPath === "/create" ||
        router.asPath === "/drop/free" ||
        router.asPath === "/drop/music"
      ) {
        router.push("/");
      } else {
        router.pop();
      }
    }, [router]);

    useEffect(() => {
      setTitle(titleProp);
    }, []);

    const shouldShowModal =
      router.pathname === matchingPathname ||
      Boolean(router.query[matchingQueryParam as any]);

    const contextValues = useMemo(() => ({ setTitle }), []);
    return (
      <ModalScreenContext.Provider value={contextValues}>
        <Modal
          ref={modalRef}
          title={title}
          visible={shouldShowModal}
          onClose={onClose}
          {...rest}
        >
          <Screen {...props} />
        </Modal>
      </ModalScreenContext.Provider>
    );
  };
}

export { withModalScreen };
