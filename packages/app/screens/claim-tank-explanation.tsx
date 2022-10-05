import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ClaimTankExplanationModal } from "app/components/claim/claim-tank-explanation";

export const ClaimeTankExplanationScreen = withModalScreen(
  ClaimTankExplanationModal,
  {
    title: "Claim Tank",
    matchingPathname: "/claim/claim-tank-explanation",
    matchingQueryParam: "claimTankExplanation",
    snapPoints: ["40%"],
    useNativeModal: false,
  }
);
