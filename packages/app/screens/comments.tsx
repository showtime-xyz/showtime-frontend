import { Suspense, useCallback, useRef } from "react";
import { Platform } from "react-native";

import { Comments } from "app/components/comments";
import { CommentsStatus } from "app/components/comments/comments-status";
import { ErrorBoundary } from "app/components/error-boundary";
import { useIsFocused } from "app/lib/react-navigation/native";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { withModalScreen } from "app/navigation/with-modal-screen";

import { Modal, ModalSheet } from "design-system";

type Query = {
  id: number;
};

const { useParam } = createParam<Query>();

const snapPoints = ["90%"];

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

export function CommentsModal() {
  const wasClosedByUserAction = useRef<boolean | undefined>(undefined);

  //#region hooks
  const isModalFocused = useIsFocused();
  const router = useRouter();
  const { top: topSafeArea } = useSafeAreaInsets();
  // @ts-ignore
  const [nftId, _] = useParam("id");
  //#endregion

  //#region callbacks
  const handleClose = useCallback(() => {
    wasClosedByUserAction.current = true;
    router.back();
  }, [router]);
  const handleOnClose = useCallback(() => {
    if (!isModalFocused) {
      return;
    }

    if (!wasClosedByUserAction.current) {
      wasClosedByUserAction.current = true;
      router.back();
    }
  }, [router, isModalFocused]);
  //#endregion

  const ModalComponent = Platform.OS === "android" ? ModalSheet : Modal;
  return (
    <ModalComponent
      title="Comments"
      snapPoints={snapPoints}
      height="h-[90vh]"
      close={handleClose}
      onClose={handleOnClose}
      keyboardVerticalOffset={topSafeArea + modalPresentationHeight}
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
      scrollable={false}
      visible={isModalFocused}
    >
      <ErrorBoundary>
        <Suspense
          fallback={<CommentsStatus isLoading={true} error={undefined} />}
        >
          <Comments nftId={nftId!} />
        </Suspense>
      </ErrorBoundary>
    </ModalComponent>
  );
}

export const CommentsScreen = withModalScreen(
  CommentsModal,
  "/nft/[id]/comments",
  "comments"
);
