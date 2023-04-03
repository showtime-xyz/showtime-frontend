import dynamic from "next/dynamic";

import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const Trending = dynamic(() => import("app/components/trending"), {
  ssr: false,
});

const TrendingScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Trending" });

  return <Trending />;
});

export { TrendingScreen };
