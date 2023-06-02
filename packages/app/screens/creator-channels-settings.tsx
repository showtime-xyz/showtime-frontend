import AlertProvider from "@showtime-xyz/universal.alert";
import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ChannelsSettings } from "app/components/creator-channels";

const ChannelsSettingsModal = () => {
  return (
    <AlertProvider>
      <ChannelsSettings />
    </AlertProvider>
  );
};
export const CreatorChannelsSettingsScreen = withModalScreen(
  ChannelsSettingsModal,
  {
    title: "Settings",
    matchingPathname: "/channels/[channelId]/settings",
    matchingQueryParam: "channelsSettingsModal",
    tw: "w-full web:lg:pb-8",
    snapPoints: [320],
    useNativeModal: false,
    closeButtonProps: {
      variant: "text",
    },
  }
);
