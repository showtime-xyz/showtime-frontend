import { DropFree } from "app/components/drop/drop-free";

import { withModalScreen } from "design-system/modal-screen";

export const DropFreeScreen = withModalScreen(DropFree, {
  title: "Create Drop",
  matchingPathname: "/drop/free",
  matchingQueryParam: "dropFree",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
