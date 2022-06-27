import { FC, useCallback, useRef } from "react";

import { ModalMethods, Modal } from "@showtime-xyz/universal.modal";

// @showtime-xyz/universal.router
import { useRouter } from "design-system/router";

import type { ModalScreenOptions } from "./types";

function withModalScreen<P>(
  Screen: FC<P>,
  { title, matchingPathname, matchingQueryParam, ...rest }: ModalScreenOptions
) {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const modalRef = useRef<ModalMethods>(null);
    const router = useRouter();

    const onClose = useCallback(() => {
      if (router.asPath === "/login" || router.asPath === "/create") {
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
