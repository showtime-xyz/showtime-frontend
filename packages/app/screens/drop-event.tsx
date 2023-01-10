import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropEvent } from "app/components/drop/drop-event";

export const DropEventScreen = withModalScreen(DropEvent, {
  title: "Event Drop",
  matchingPathname: "/drop/event",
  matchingQueryParam: "dropEvent",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
