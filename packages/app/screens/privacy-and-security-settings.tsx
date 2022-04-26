import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { mixpanel } from "app/lib/mixpanel";

import { PrivacyAndSecuritySettings } from "../components/settings/privacy-and-security";

const PrivacySecuritySettingsScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Privacy and Security screen");
  }, []);

  return <PrivacyAndSecuritySettings />;
});

export { PrivacySecuritySettingsScreen };
