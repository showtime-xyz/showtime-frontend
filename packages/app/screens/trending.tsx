import { Home } from "app/components/home";
import { withColorScheme } from "app/components/memo-with-theme";
import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import { useTrackPageViewed } from "app/lib/analytics";

const TrendingScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Trending" });
  useIntroducingCreatorChannels();

  return <Home />;
});

export { TrendingScreen };
