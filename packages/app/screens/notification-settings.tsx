import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const NotificationSettingsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Notification Settings" });

  return null;
});

export { NotificationSettingsScreen };
