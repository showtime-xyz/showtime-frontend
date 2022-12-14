import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { FollowingModal } from "app/components/follow-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const FollowingScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <FollowingModal />
    </>
  );
};
