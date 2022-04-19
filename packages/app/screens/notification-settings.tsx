import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

const NotificationSettingsScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Notification Settings screen");
  }, []);

  return null;
});

export { NotificationSettingsScreen };
