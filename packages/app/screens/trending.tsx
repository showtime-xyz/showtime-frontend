import { withColorScheme } from "app/components/memo-with-theme";
import { Trending } from "app/components/trending";
import { Trending as TrendingMD } from "app/components/trending/trending.md";
import { useTrackPageViewed } from "app/lib/analytics";

import { Hidden } from "design-system/hidden";

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
