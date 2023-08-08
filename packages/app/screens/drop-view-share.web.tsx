import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropViewShareComponent } from "app/components/drop/drop-view-share";

export const DropViewShareScreen = withModalScreen(DropViewShareComponent, {
  title: "",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/share",
  matchingQueryParam: "dropViewShareModal",
  snapPoints: ["100%"],
  headerShown: false,
  tw: "!pb-0",
});
