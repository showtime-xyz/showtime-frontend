import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropFree } from "app/components/drop/drop-free";

export const DropFreeScreen = withModalScreen(DropFree, {
  title: "Free Drop",
  matchingPathname: "/drop/free",
  matchingQueryParam: "dropFree",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
