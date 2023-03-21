import { Platform } from "react-native";

import { FollowerModal } from "app/components/follow-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View } from "design-system/view";

export const FollowersScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <FollowerModal />
    </>
  );
};
