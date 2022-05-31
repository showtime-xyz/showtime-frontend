import React from "react";

import { Drop } from "app/components/drop";

import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

const DropModal = () => {
  return <Drop />;
};

export const DropScreen = withModalScreen(DropModal, {
  title: "Drop NFT",
  matchingPathname: "/nft/drop",
  matchingQueryParam: "dropNFTModal",
  tw: "w-full lg:w-200",
  disableBackdropPress: true,
});
