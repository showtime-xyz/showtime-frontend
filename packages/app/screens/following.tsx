import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { FollowingModal } from "app/components/follow-modal";

export const FollowingScreen = withModalScreen(FollowingModal, {
  title: "following",
  matchingPathname: "/profile/following",
  matchingQueryParam: "followingModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
