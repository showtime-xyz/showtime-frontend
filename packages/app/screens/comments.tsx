import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { CommentsModal } from "app/components/comments-modal";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const CommentsScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}

      <CommentsModal />
    </>
  );
};
