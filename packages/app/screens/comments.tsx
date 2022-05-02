import { Suspense } from "react";

import { Comments } from "app/components/comments";
import { CommentsStatus } from "app/components/comments/comments-status";
import { ErrorBoundary } from "app/components/error-boundary";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { createParam } from "app/navigation/use-param";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

function CommentsModal() {
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  return (
    <ErrorBoundary>
      <Suspense
        fallback={<CommentsStatus isLoading={true} error={undefined} />}
      >
        <Comments nft={data?.data?.item} />
      </Suspense>
    </ErrorBoundary>
  );
}

export const CommentsScreen = withModalScreen(CommentsModal, {
  title: "Comments",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/comments",
  matchingQueryParam: "commentsModal",
});
