import { LikersModal } from "app/components/likers-modal";

import { withModalScreen } from "design-system/modal-screen";

export const LikersScreen = withModalScreen(LikersModal, {
  title: "Likers",
  matchingPathname: "/collectors/[nftId]",
  matchingQueryParam: "likersModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
