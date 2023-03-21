import { Platform } from "react-native";

import { LikersModal } from "app/components/likers-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View } from "design-system/view";

export const LikersScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <LikersModal />
    </>
  );
};
