import { ClaimLimitExplanationModal } from "app/components/claim/claim-limit-explanation";

import { withModalScreen } from "design-system/modal-screen";

export const ClaimLimitExplanationScreen = withModalScreen(
  ClaimLimitExplanationModal,
  {
    title: "Claim Limit",
    matchingPathname: "/claim/claim-limit-explanation",
    matchingQueryParam: "claimLimitExplanationModal",
    snapPoints: [240],
    useNativeModal: false,
  }
);
