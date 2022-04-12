import { Suspense } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { useModal } from "app/hooks/use-modal";
import { createParam } from "app/navigation/use-param";

import NFTActivities from "../components/nft-activity";

type Query = {
  nftId: number;
};

const { useParam } = createParam<Query>();

export function NFTActivitiesScreen() {
  const [NFTActivityModal, modalProps] = useModal();

  // @ts-ignore
  const [nftId, _] = useParam("nftId");

  return (
    <NFTActivityModal title="Activity" {...modalProps}>
      <ErrorBoundary>
        <Suspense fallback={() => null}>
          <NFTActivities {...{ nftId }} />
        </Suspense>
      </ErrorBoundary>
    </NFTActivityModal>
  );
}
