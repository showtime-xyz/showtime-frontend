import { Suspense, useCallback, useRef } from "react";
import { Platform } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Comments } from "app/components/comments";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";

import { CommentsStatus } from "../components/comments/comments-status";

type Query = {
  nftId: number;
};

const { useParam } = createParam<Query>();

const snapPoints = ["90%"];

export function CommentsScreen() {
  const wasClosedByUserAction = useRef<boolean | undefined>(undefined);

  //#region hooks
  const router = useRouter();
  // @ts-ignore
  const [nftId, _] = useParam("nftId");
  //#endregion

  //#region callbacks
  const handleClose = useCallback(() => {
    wasClosedByUserAction.current = true;
    router.back();
  }, [router]);
  const handleOnClose = useCallback(() => {
    if (!wasClosedByUserAction.current) {
      wasClosedByUserAction.current = true;
      router.back();
    }
  }, [router]);
  //#endregion

  const CommentsModal = Platform.OS === "android" ? ModalSheet : Modal;

  return (
    <CommentsModal
      title="Comments"
      snapPoints={snapPoints}
      height="h-[90vh]"
      close={handleClose}
      onClose={handleOnClose}
    >
      <Suspense
        fallback={<CommentsStatus isLoading={true} error={undefined} />}
      >
        <Comments nftId={nftId!} />
      </Suspense>
    </CommentsModal>
  );
}
