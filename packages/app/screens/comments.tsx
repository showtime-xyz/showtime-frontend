import { Suspense } from "react";
import { Platform } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Comments } from "app/components/comments";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet, Spinner } from "design-system";

type Query = {
  nftId: number;
};

const { useParam } = createParam<Query>();

const snapPoints = ["90%"];

export function CommentsScreen() {
  //#region hooks
  const router = useRouter();
  const [nftId, _] = useParam("nftId");
  //#endregion

  console.log("CommentsScreen", nftId);

  const CommentsModal = Platform.OS === "android" ? ModalSheet : Modal;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CommentsModal
        title="Comments"
        snapPoints={snapPoints}
        height="h-[90vh]"
        // bodyContentTW="bg-white"
        close={router.back}
        onClose={router.back}
      >
        <Suspense fallback={<Spinner size="small" />}>
          <Comments nftId={nftId!} />
        </Suspense>
      </CommentsModal>
    </GestureHandlerRootView>
  );
}
