import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorTokensExplanation } from "app/components/profile/tokens-explanation";

export const CreatorTokensExplanationScreen = withModalScreen(
  CreatorTokensExplanation,
  {
    title: "",
    matchingPathname: "/creatorTokensExplanation",
    matchingQueryParam: "creatorTokensExplanationModal",
    tw: "w-full md:w-[420px] web:lg:pb-8",
    snapPoints: [400],
    useNativeModal: false,
  }
);
