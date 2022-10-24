import { withColorScheme } from "app/components/memo-with-theme";
import { Trending } from "app/components/trending";
import { useTrackPageViewed } from "app/lib/analytics";

const TrendingScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Trending" });

  return <Trending />;
});

export { TrendingScreen };
