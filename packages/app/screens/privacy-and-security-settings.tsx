import { withColorScheme } from "app/components/memo-with-theme";
import { PrivacyAndSecuritySettings } from "app/components/settings/privacy-and-security";
import { useTrackPageViewed } from "app/lib/analytics";

const PrivacySecuritySettingsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Privacy and Security" });

  return <PrivacyAndSecuritySettings />;
});

export { PrivacySecuritySettingsScreen };
