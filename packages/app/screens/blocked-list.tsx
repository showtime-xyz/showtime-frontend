import { withColorScheme } from "app/components/memo-with-theme";
import { BlockedList } from "app/components/settings/blocked-list";
import { useTrackPageViewed } from "app/lib/analytics";

const BlockedListScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Blocked List" });

  return <BlockedList />;
});

export { BlockedListScreen };
