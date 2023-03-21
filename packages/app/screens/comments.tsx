import { Platform } from "react-native";

import { CommentsModal } from "app/components/comments-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { View } from "design-system/view";

export const CommentsScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <CommentsModal />
    </>
  );
};
