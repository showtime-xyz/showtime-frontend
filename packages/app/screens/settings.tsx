import { withColorScheme } from "app/components/memo-with-theme";
import { Settings } from "app/components/settings";
import { useTrackPageViewed } from "app/lib/analytics";

const SettingsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Settings" });

  return <Settings />;
});

export { SettingsScreen };
