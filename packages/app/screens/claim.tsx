import { Claim } from "app/components/claim/claim";

import { withModalScreen } from "design-system/modal-screen";

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
