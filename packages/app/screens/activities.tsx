import { Suspense } from "react";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ErrorBoundary } from "app/components/error-boundary";
import { Activities } from "app/components/nft-activity";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useTrackPageViewed } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();

export function ActivitiesModal() {
  useTrackPageViewed({ name: "Activity" });
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data: nftDetails } = useNFTDetailByTokenId({
    chainName: chainName as string,
    tokenId: tokenId as string,
    contractAddress: contractAddress as string,
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Activities nft={nftDetails?.data?.item} />
      </Suspense>
    </ErrorBoundary>
  );
}

export const ActivitiesScreen = withModalScreen(ActivitiesModal, {
  title: "Activity",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/activity",
  matchingQueryParam: "activityModal",
});
