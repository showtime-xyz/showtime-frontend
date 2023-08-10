import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropImageShare } from "app/components/qr-code";

export const DropImageShareScreen = withModalScreen(DropImageShare, {
  title: "Congrats! Now share it.",
  matchingPathname: "/drop-image-share/[contractAddress]",
  matchingQueryParam: "dropImageShareModal",
  snapPoints: ["100%"],
});
