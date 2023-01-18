import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { FollowerModal } from "app/components/follow-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const FollowersScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <FollowerModal />
    </>
  );
};
