import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { MessageReactionUserListModal } from "app/components/creator-channels";

export const CreatorChannelsMessageReactionsScreen = withModalScreen(
  MessageReactionUserListModal,
  {
    title: "Reactions",
    matchingPathname: "/channels/[channelId]/messages/[messageId]/reactions",
    matchingQueryParam: "channelsReactionModal",
    tw: "min-h-[300px]",
  }
);
