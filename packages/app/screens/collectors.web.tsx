import { CollectorsModal } from "app/components/collectors-modal";

import { withModalScreen } from "design-system/modal-screen";

export const CollectorsScreen = withModalScreen(CollectorsModal, {
  title: "Collectors",
  matchingPathname: "/collectors/[chainName]/[contractAddress]/[tokenId]",
  matchingQueryParam: "collectorsModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
