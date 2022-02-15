import { useEffect } from "react";

import { Feed } from "app/components/feed";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";
import { mixpanel } from "app/lib/mixpanel";

const HomeScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);
  useTrackPageViewed({ name: "Home" });

  return <Feed />;
});

export { HomeScreen };
