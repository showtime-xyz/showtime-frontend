import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Settings } from "app/components/settings";

const SettingsScreen = () => {
  useEffect(() => {
    mixpanel.track("Settings view");
  }, []);

  return <Settings />;
};

export { SettingsScreen };
