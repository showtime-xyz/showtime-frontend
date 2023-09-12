import { View } from "@showtime-xyz/universal.view";

import { ConnectWithTwitter } from "app/components/login/connect-with-twitter";
import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

export const HomeScreenV2 = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  return (
    <View tw="mt-40">
      <ConnectWithTwitter />
    </View>
  );
});
