import { Platform } from "react-native";

import { CollectorsModal } from "app/components/collectors-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View } from "design-system/view";

export const CollectorsScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <CollectorsModal />
    </>
  );
};
