import { useEffect } from "react";

import { CreatorChannels } from "app/components/creator-channels";
import { withColorScheme } from "app/components/memo-with-theme";
import { useRedirectToChannelIntro } from "app/hooks/use-redirect-to-channel-intro";
import { useTrackPageViewed } from "app/lib/analytics";
import { getIsShowCreatorChannelIntro } from "app/lib/mmkv-keys";

const CreatorChannelsScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Creator Channels" });
  const redirectToCreatorChannelIntro = useRedirectToChannelIntro();
  useEffect(() => {
    if (getIsShowCreatorChannelIntro()) {
      setTimeout(() => {
        redirectToCreatorChannelIntro();
      }, 600);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CreatorChannels />;
});

export { CreatorChannelsScreen };
