import { CreatorChannels } from "app/components/creator-channels";
import { withColorScheme } from "app/components/memo-with-theme";
import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import { ScreenContainer } from "app/components/screen-container";
import { useAuthScreen } from "app/hooks/use-auth-screen";
import { useTrackPageViewed } from "app/lib/analytics";

const CreatorChannelsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Creator Channels" });
  useAuthScreen();

  useIntroducingCreatorChannels();

  return (
    <ScreenContainer>
      <CreatorChannels />
    </ScreenContainer>
  );
});

export { CreatorChannelsScreen };
