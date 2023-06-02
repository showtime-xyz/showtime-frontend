import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ChannelsPromote } from "app/components/creator-channels";

export const CreatorChannelsShareScreen = withModalScreen(ChannelsPromote, {
  title: "",
  matchingPathname: "/channels/[channelId]/share",
  matchingQueryParam: "channelsShareModal",
  tw: "w-full",
  disableBackdropPress: true,
  snapPoints: ["100%"],
});
