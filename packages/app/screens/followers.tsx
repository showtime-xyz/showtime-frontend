import { FollowerModal } from "app/components/follow-modal";

import { withModalScreen } from "design-system/modal-screen";

export const FollowersScreen = withModalScreen(FollowerModal, {
  title: "followers",
  matchingPathname: "/profile/followers",
  matchingQueryParam: "followersModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
