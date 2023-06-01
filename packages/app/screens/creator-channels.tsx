import { CreatorChannels } from "app/components/creator-channels";
import { withColorScheme } from "app/components/memo-with-theme";
import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";

const CreatorChannelsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Creator Channels" });
  useUser({
    redirectTo: "/login",
  });

  useIntroducingCreatorChannels();

  return <CreatorChannels />;
});

export { CreatorChannelsScreen };
