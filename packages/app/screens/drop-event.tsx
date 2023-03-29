import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropEvent } from "app/components/drop/drop-event";

export const DropEventScreen = withModalScreen(DropEvent, {
  title: "Event Drop",
  matchingPathname: "/drop/event",
  matchingQueryParam: "dropEvent",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  snapPoints: ["100%"],
});
