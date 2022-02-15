import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Settings } from "app/components/settings";
import { mixpanel } from "app/lib/mixpanel";

const SettingsScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Settings view");
  }, []);

  return <Settings />;
});

export { SettingsScreen };
