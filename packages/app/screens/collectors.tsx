import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CollectorsModal } from "app/components/collectors-modal";

export const CollectorsScreen = withModalScreen(CollectorsModal, {
  title: "Collectors",
  matchingPathname: "/collectors/[chainName]/[contractAddress]/[tokenId]",
  matchingQueryParam: "collectorsModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
