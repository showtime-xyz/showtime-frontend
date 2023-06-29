import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorChannelsIntro } from "app/components/creator-channels";
import { setHideCreatorChannelIntro } from "app/lib/mmkv-keys";

export const CreatorChannelsIntroScreen = withModalScreen(
  CreatorChannelsIntro,
  {
    title: "",
    matchingPathname: "/channels/intro",
    matchingQueryParam: "channelsIntroModal",
    tw: "w-full",
    disableBackdropPress: true,
    snapPoints: ["100%"],
    enableContentPanningGesture: false,
    enableHandlePanningGesture: false,
    closeButtonProps: {
      variant: "text",
      tw: "-mt-4 web:mt-0",
    },
    onScreenDismiss: () => {
      setHideCreatorChannelIntro(true);
    },
  }
);
