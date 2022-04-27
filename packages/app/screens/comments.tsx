import { Suspense, useCallback, useRef } from "react";
import { Platform } from "react-native";

import { Comments } from "app/components/comments";
import { CommentsStatus } from "app/components/comments/comments-status";
import { ErrorBoundary } from "app/components/error-boundary";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useIsFocused } from "app/lib/react-navigation/native";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { withModalScreen } from "app/navigation/with-modal-screen";

import { Modal, ModalSheet } from "design-system";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
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
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });
  //#endregion

  //#region callbacks
  const handleClose = useCallback(() => {
    wasClosedByUserAction.current = true;
    router.pop();
  }, [router]);
  const handleOnClose = useCallback(() => {
    if (!isModalFocused) {
      return;
    }

    if (!wasClosedByUserAction.current) {
      wasClosedByUserAction.current = true;
      router.pop();
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
          <Comments nft={data?.data?.item} />
        </Suspense>
      </ErrorBoundary>
    </ModalComponent>
  );
}

export const CommentsScreen = withModalScreen(
  CommentsModal,
  "/nft/[chainName]/[contractAddress]/[tokenId]/comments",
  "commentsModal"
);
