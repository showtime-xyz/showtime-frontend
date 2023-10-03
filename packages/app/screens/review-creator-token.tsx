import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ReviewCreatorToken } from "app/components/review-creator-token";

export const ReviewCreatorTokenScreen = withModalScreen(ReviewCreatorToken, {
  title: "",
  matchingPathname: "/profile/review-creator-token",
  matchingQueryParam: "reviewCreatorToken",
  snapPoints: ["100%"],
  disableBackdropPress: true,
});
