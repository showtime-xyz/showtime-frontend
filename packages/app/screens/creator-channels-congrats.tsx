import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorChannelsCongrats } from "app/components/creator-channels";

export const CreatorChannelsCongratsScreen = withModalScreen(
  CreatorChannelsCongrats,
  {
    title: "",
    matchingPathname: "/channels/[channelId]/congrats",
    matchingQueryParam: "channelsCongratsModal",
    tw: "w-full",
    disableBackdropPress: true,
    snapPoints: ["100%"],
    closeButtonProps: {
      variant: "text",
      tw: "-mt-4 web:mt-0",
    },
  }
);
