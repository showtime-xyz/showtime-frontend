import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Feed } from "app/components/feed";
import { withColorScheme } from "../components/memo-with-theme";

const HomeScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  return <Feed />;
});

export { HomeScreen };
