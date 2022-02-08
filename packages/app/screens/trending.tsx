import { useEffect } from "react";

import { Trending } from "app/components/trending";
import { mixpanel } from "app/lib/mixpanel";
import { withColorScheme } from "app/components/memo-with-theme";

const TrendingScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Trending page view");
  }, []);

  return <Trending />;
});

export { TrendingScreen };
