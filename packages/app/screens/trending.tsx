import { View } from "@showtime-xyz/universal.view";

import { TopCreatorTokens } from "app/components/creator-token/top-creator-token";
import { withColorScheme } from "app/components/memo-with-theme";
import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import { useTrackPageViewed } from "app/lib/analytics";

const TrendingScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Trending" });
  useIntroducingCreatorChannels();

  return (
    <View tw="min-h-screen w-full bg-white dark:bg-black">
      <View tw="mx-auto w-full md:max-w-screen-lg">
        <TopCreatorTokens />
      </View>
    </View>
  );
});

export { TrendingScreen };
