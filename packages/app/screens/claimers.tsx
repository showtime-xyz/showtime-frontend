import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ClaimersModal } from "app/components/claimers-modal";

export const ClaimersScreen = withModalScreen(ClaimersModal, {
  title: "Claimers",
  matchingPathname: "/claimers/[chainName]/[contractAddress]/[tokenId]",
  matchingQueryParam: "claimersModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
