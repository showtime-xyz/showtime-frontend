import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { CreatorChannelsMembersModal } from "app/components/creator-channels";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const CreatorChannelsMembersScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      <CreatorChannelsMembersModal />
    </>
  );
};
