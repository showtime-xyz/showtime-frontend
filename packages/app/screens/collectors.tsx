import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { CollectorsModal } from "app/components/collectors-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const CollectorsScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <CollectorsModal />
    </>
  );
};
