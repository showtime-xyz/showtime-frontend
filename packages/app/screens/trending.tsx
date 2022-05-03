import { withColorScheme } from "app/components/memo-with-theme";
import { Trending } from "app/components/trending";
import { useTrackPageViewed } from "app/lib/analytics";

import { Hidden } from "design-system/hidden";

import { Trending as TrendingMD } from "./trending.md";

const TrendingScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Trending" });

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
