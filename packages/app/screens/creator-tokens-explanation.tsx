import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorTokensExplanation } from "app/components/profile/tokens-explanation";

export const CreatorTokensExplanationScreen = withModalScreen(
  CreatorTokensExplanation,
  {
    title: "",
    matchingPathname: "/creator-token/explanation",
    matchingQueryParam: "creatorTokensExplanationModal",
    tw: "w-full md:w-[420px] web:lg:pb-8",
    snapPoints: [400],
    useNativeModal: false,
  }
);
