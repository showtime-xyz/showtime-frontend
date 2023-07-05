import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropEditDetails } from "app/components/drop/drop-edit-details";

export const DropEditDetailsScreen = withModalScreen(DropEditDetails, {
  title: "Edit Drop Details",
  matchingPathname:
    "/drop/edit-details/[chainName]/[contractAddress]/[tokenId]",
  matchingQueryParam: "dropEditDetailsModal",
  tw: "w-full",
  snapPoints: ["100%"],
});
