import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ClaimLimitExplanationModal } from "app/components/claim/claim-limit-explanation";

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
