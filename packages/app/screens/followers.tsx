import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { FollowerModal } from "app/components/follow-modal";

export const FollowersScreen = withModalScreen(FollowerModal, {
  title: "Followers",
  matchingPathname: "/profile/followers",
  matchingQueryParam: "followersModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
