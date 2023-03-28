import dynamic from "next/dynamic";

import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const Settings = dynamic(() => import("app/components/settings"), {
  ssr: false,
});
const SettingsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Settings" });

  return <Settings />;
});

export { SettingsScreen };
