import { Platform } from "react-native";

import { FollowingModal } from "app/components/follow-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View } from "design-system/view";

export const FollowingScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <FollowingModal />
    </>
  );
};
