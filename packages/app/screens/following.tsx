import { FollowingModal } from "app/components/follow-modal";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

export const FollowingScreen = withModalScreen(FollowingModal, {
  title: "following",
  matchingPathname: "/profile/following",
  matchingQueryParam: "followingModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
