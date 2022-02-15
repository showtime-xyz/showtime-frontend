import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Settings } from "app/components/settings";
import { useTrackPageViewed } from "app/lib/analytics";
import { mixpanel } from "app/lib/mixpanel";

const SettingsScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Settings view");
  }, []);
  useTrackPageViewed({ name: "Settings" });

  return <Settings />;
});

export { SettingsScreen };
