import React from "react";
import { withModalScreen } from "design-system/modal-screen/with-modal-screen";
import {Claim} from "app/components/claim"


const ClaimModal = () => {
  return <Claim />
};

export const ClaimScreen = withModalScreen(ClaimModal, {
  title: "Claim",
  matchingPathname: "/claim/[collectionAddress]",
  matchingQueryParam: "claimModal",
});
