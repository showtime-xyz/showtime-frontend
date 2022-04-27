import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Trending } from "app/components/trending";
import { mixpanel } from "app/lib/mixpanel";

import { Hidden } from "design-system/hidden";

import { Trending as TrendingMD } from "./trending.md";

const TrendingScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Trending page view");
  }, []);

  return (
    <>
      <Hidden from="md">
        <Trending />
      </Hidden>
      <Hidden until="md">
        <TrendingMD />
      </Hidden>
    </>
  );
});

export { TrendingScreen };
