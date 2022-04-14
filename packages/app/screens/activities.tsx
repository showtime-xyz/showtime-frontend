import { Suspense } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { useModal } from "app/hooks/use-modal";
import { createParam } from "app/navigation/use-param";
import { withModalScreen } from "app/navigation/with-modal-screen";

import NFTActivities from "../components/nft-activity";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

export function ActivitiesModal() {
  const [ModalComponent, modalProps] = useModal();
  const [nftId, _] = useParam("id");

  return (
    <ModalComponent title="Activity" {...modalProps}>
      <ErrorBoundary>
        <Suspense fallback={() => null}>
          <NFTActivities {...{ nftId }} />
        </Suspense>
      </ErrorBoundary>
    </ModalComponent>
  );
}

export const ActivitiesScreen = withModalScreen(
  ActivitiesModal,
  "/nft/[id]/activities",
  "activities"
);
