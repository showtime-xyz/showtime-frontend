import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropStar } from "app/components/drop/drop-star";

export const DropStarScreen = withModalScreen(DropStar, {
  title: "Create a Drop",
  matchingPathname: "/drop/star",
  matchingQueryParam: "dropStar",
  tw: "w-full lg:w-[800px] !pb-0 md:max-h-[98vh]",
  disableBackdropPress: true,
  snapPoints: ["100%"],
  headerShown: false,
});
