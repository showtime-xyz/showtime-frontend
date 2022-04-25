import { Suspense, useCallback, useRef } from "react";
import { Platform } from "react-native";

import { Comments } from "app/components/comments";
import { CommentsStatus } from "app/components/comments/comments-status";
import { ErrorBoundary } from "app/components/error-boundary";
import { withModalScreen } from "app/navigation/modal-screen/with-modal-screen";
import { createParam } from "app/navigation/use-param";

type Query = {
  id: number;
};

const { useParam } = createParam<Query>();

function CommentsModal() {
  //#region hooks
  // @ts-ignore
  const [nftId, _] = useParam("id");
  //#endregion
  return (
    <ErrorBoundary>
      <Suspense
        fallback={<CommentsStatus isLoading={true} error={undefined} />}
      >
        <Comments nftId={nftId!} />
      </Suspense>
    </ErrorBoundary>
  );
}

export const CommentsScreen = withModalScreen(CommentsModal, "Comments");
