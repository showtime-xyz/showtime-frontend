import { Claim } from "app/components/claim/claim";

import { withModalScreen } from "design-system/modal-screen";

const ClaimModal = () => {
  return <Claim />;
};

export const ClaimScreen = withModalScreen(ClaimModal, {
  title: "Claim",
  matchingPathname: "/claim/[contractAddress]",
  matchingQueryParam: "claimModal",
  disableBackdropPress: true,
});
