import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Claim } from "app/components/claim/claim";

const ClaimModal = () => {
  return <Claim />;
};

export const ClaimScreen = withModalScreen(ClaimModal, {
  title: "Collect",
  matchingPathname: "/claim/[contractAddress]",
  matchingQueryParam: "claimModal",
  disableBackdropPress: true,
  snapPoints: ["100%"],
});
