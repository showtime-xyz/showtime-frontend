import { withColorScheme } from "app/components/memo-with-theme";
import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import Trending from "app/components/trending";
import { useTrackPageViewed } from "app/lib/analytics";

const TrendingScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Trending" });
  useIntroducingCreatorChannels();

  return <Trending />;
});

export { TrendingScreen };
