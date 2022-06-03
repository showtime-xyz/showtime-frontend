import { FollowerModal } from "app/components/follow-modal";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

export const FollowerScreen = withModalScreen(FollowerModal, {
  title: "followers",
  matchingPathname: "/profile/followers",
  matchingQueryParam: "followersModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
