import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Settings } from "app/components/settings";
import { withColorScheme } from "app/components/memo-with-theme";

const SettingsScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Settings view");
  }, []);

  return <Settings />;
});

export { SettingsScreen };
