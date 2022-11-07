import { FC, useCallback, useRef } from "react";

import { ModalMethods, Modal } from "@showtime-xyz/universal.modal";
import { useRouter } from "@showtime-xyz/universal.router";

import type { ModalScreenOptions } from "./types";

function withModalScreen<P extends object>(
  Screen: FC<P>,
  { title, matchingPathname, matchingQueryParam, ...rest }: ModalScreenOptions
) {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const modalRef = useRef<ModalMethods>(null);
    const router = useRouter();

    const onClose = useCallback(() => {
      if (
        router.asPath === "/login" ||
        router.asPath === "/create" ||
        router.asPath === "/drop"
      ) {
        router.push("/");
      } else {
        router.pop();
      }
    }, [router]);

    const shouldShowModal =
      router.pathname === matchingPathname ||
      Boolean(router.query[matchingQueryParam as any]);

    if (!shouldShowModal) {
      return null;
    }

    return (
      <Modal
        ref={modalRef}
        title={title}
        web_height="auto"
        onClose={onClose}
        {...rest}
      >
        <Screen {...props} />
      </Modal>
    );
  };
}

export { withModalScreen };
