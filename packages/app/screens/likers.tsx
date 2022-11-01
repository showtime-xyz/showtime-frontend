import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { LikersModal } from "app/components/likers-modal";

export const LikersScreen = withModalScreen(LikersModal, {
  title: "Likers",
  matchingPathname: "/collectors/[nftId]",
  matchingQueryParam: "likersModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
