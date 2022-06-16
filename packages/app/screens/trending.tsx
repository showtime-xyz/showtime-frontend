import { Hidden } from "@showtime-xyz/universal.hidden";

import { withColorScheme } from "app/components/memo-with-theme";
import { Trending } from "app/components/trending";
import { useTrackPageViewed } from "app/lib/analytics";

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
