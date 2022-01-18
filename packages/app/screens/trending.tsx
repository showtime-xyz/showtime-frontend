import { Trending } from "app/components/trending";
import { useEffect } from "react";
import { mixpanel } from "app/lib/mixpanel";

function TrendingScreen() {
  useEffect(() => {
    mixpanel.track("Trending page view");
  }, []);

  return <Trending />;
}

export { TrendingScreen };
