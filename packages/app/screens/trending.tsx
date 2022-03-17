import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Trending } from "app/components/trending";
import { mixpanel } from "app/lib/mixpanel";

const TrendingScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Trending page view");
  }, []);

  return <Trending />;
});

export { TrendingScreen };
