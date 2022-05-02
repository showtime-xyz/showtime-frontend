import { Suspense } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { Activities } from "app/components/nft-activity";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { createParam } from "app/navigation/use-param";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

export function ActivitiesModal() {
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
      <Suspense fallback={() => null}>
        <Activities nft={data?.data?.item} />
      </Suspense>
    </ErrorBoundary>
  );
}

export const ActivitiesScreen = withModalScreen(ActivitiesModal, {
  title: "Activities",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/activities",
  matchingQueryParam: "activitiesModal",
});
