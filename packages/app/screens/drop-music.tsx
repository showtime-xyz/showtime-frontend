import { DropMusic } from "app/components/drop/drop-music";

import { withModalScreen } from "design-system/modal-screen";

export const DropMusicScreen = withModalScreen(DropMusic, {
  title: "Music Drop: Pre-Save on Spotify",
  matchingPathname: "/drop/music",
  matchingQueryParam: "dropMusic",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
