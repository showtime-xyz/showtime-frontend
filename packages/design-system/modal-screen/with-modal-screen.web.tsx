import { FC, useCallback, useRef } from "react";

import { useRouter } from "app/navigation/use-router";

import { ModalMethods } from "design-system/modal";
import { ModalScreen } from "design-system/modal/modal.screen";

import type { ModalScreenOptions } from "./types";

function withModalScreen<P>(
  Screen: FC<P>,
  { title, matchingPathname, matchingQueryParam }: ModalScreenOptions
) {
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
      <ModalScreen
        ref={modalRef}
        title={title}
        web_height="auto"
        onClose={onClose}
      >
        <Screen {...props} />
      </ModalScreen>
    );
  };
}

export { withModalScreen };
