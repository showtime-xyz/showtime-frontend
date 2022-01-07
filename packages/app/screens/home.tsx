import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Feed } from "app/components/feed";

const HomeScreen = () => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  return <Feed />;
};

export { HomeScreen };
