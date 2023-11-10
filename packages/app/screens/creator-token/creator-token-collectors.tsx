import { Platform } from "react-native";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreatorTokenCollectorsList } from "app/components/creator-token/creator-token-collectors";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const CreatorTokenCollectorsModalScreen = withModalScreen(
  CreatorTokenCollectorsList,
  {
    title: "",
    matchingPathname: "/creator-token/[profileId]/collectors",
    matchingQueryParam: "creatorTokenCollectorsModal",
    enableContentPanningGesture: false,
    snapPoints: ["90%"],
  }
);

export const CreatorTokenCollectorsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "creatorTokenCollectorsScreen" });
  if (Platform.OS === "web") {
    return <CreatorTokenCollectorsModalScreen />;
  }
  return <CreatorTokenCollectorsList />;
});
