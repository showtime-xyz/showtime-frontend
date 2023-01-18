import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropPrivate } from "app/components/drop/drop-private";

export const DropPrivateScreen = withModalScreen(DropPrivate, {
  title: "Private Drop",
  matchingPathname: "/drop/private",
  matchingQueryParam: "dropPrivate",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
