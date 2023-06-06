import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorChannelsMembersModal } from "app/components/creator-channels";

export const CreatorChannelsMembersScreen = withModalScreen(
  CreatorChannelsMembersModal,
  {
    title: "Members",
    matchingPathname: "/channels/[channelId]/members",
    matchingQueryParam: "channelsMembersModal",
    snapPoints: ["98%"],
  }
);
