import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { UnlockedChannel } from "app/components/creator-channels/channel-unlocked";

export const UnlockedChannelScreen = withModalScreen(UnlockedChannel, {
  title: "",
  matchingPathname: "/channels/[channelId]/[contractAddress]/unlocked",
  matchingQueryParam: "unlockedChannelModal",
  disableBackdropPress: true,
  snapPoints: ["100%"],
  headerShown: false,
  tw: "!pb-0",
});
