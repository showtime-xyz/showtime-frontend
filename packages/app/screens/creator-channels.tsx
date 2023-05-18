import { CreatorChannelsList } from "app/components/creator-channels";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

const CreatorChannelsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Creator Channels" });
  return <CreatorChannelsList />;
});

export { CreatorChannelsScreen };
