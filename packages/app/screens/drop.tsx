import React from "react";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Drop } from "app/components/drop";

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
