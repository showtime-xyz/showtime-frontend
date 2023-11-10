import { Platform } from "react-native";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorTokenCollectedList } from "app/components/creator-token/creator-token-collected";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const CreatorTokenCollectedModalScreen = withModalScreen(
  CreatorTokenCollectedList,
  {
    title: "",
    matchingPathname: "/creator-token/[creatorTokenId]/collectors",
    matchingQueryParam: "creatorTokenCollectedModal",
    enableContentPanningGesture: false,
    snapPoints: ["90%"],
  }
);

export const CreatorTokenCollectedScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "creatorTokenCollectedScreen" });
  if (Platform.OS === "web") {
    return <CreatorTokenCollectedModalScreen />;
  }
  return <CreatorTokenCollectedList />;
});
