import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { UnlockedChannelModal } from "app/components/creator-channels/channel-unlocked";

export const UnlockedChannelScreen = withModalScreen(UnlockedChannelModal, {
  title: "",
  matchingPathname: "/channels/[contractAddress]/unlocked",
  matchingQueryParam: "unlockedChannelModal",
  disableBackdropPress: true,
  snapPoints: ["100%"],
  headerShown: false,
  tw: "!pb-0 !bg-transparent",
});
