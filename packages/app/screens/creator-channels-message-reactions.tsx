import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { MessageReactionUserListModal } from "app/components/creator-channels";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const CreatorChannelsMessageReactionsScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      <MessageReactionUserListModal />
    </>
  );
};
