import { withColorScheme } from "app/components/memo-with-theme";
import Settings from "app/components/settings";
import { useAuthScreen } from "app/hooks/use-auth-screen";
import { useTrackPageViewed } from "app/lib/analytics";

const SettingsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Settings" });
  useAuthScreen();

  return <Settings />;
});

export { SettingsScreen };
