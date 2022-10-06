import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ClaimLimitExplanationModal } from "app/components/claim/claim-limit-explanation";

export const ClaimeLimitExplanationScreen = withModalScreen(
  ClaimLimitExplanationModal,
  {
    title: "Claim Limit",
    matchingPathname: "/claim/claim-limit-explanation",
    matchingQueryParam: "claimLimitExplanation",
    snapPoints: [240],
    useNativeModal: false,
  }
);
