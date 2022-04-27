import { FC, useCallback, useRef } from "react";

import { useRouter } from "app/navigation/use-router";

import { ModalMethods } from "design-system/modal-new";
import { ModalScreen } from "design-system/modal-new/modal.screen";

function withModalScreen<P>(
  Screen: FC<P>,
  title: string,
  matchingPathname: string,
  matchingQueryParam: string
) {
  return function (props: P) {
    const modalRef = useRef<ModalMethods>(null);
    const { pathname, query, pop } = useRouter();

    const onClose = useCallback(() => {
      pop();
    }, [pop]);

    const shouldShowModal =
      pathname === matchingPathname ||
      Boolean(query[matchingQueryParam as any]);

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
