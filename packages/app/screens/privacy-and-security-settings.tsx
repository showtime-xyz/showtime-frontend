import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

const PrivacySecuritySettingsScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Privacy and Security screen");
  }, []);

  return null;
});

export { PrivacySecuritySettingsScreen };
