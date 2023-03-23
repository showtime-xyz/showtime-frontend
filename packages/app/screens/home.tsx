import { Button } from "@showtime-xyz/universal.button";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { useAppleMusicToken } from "app/hooks/use-apple-music-token/use-apple-music-token";
import { useTrackPageViewed } from "app/lib/analytics";

const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  const { getUserToken } = useAppleMusicToken();

  return (
    <View style={{ marginTop: 100 }}>
      <Button
        onPress={async () => {
          const v = await getUserToken();
          console.log("Token ", v);
        }}
      >
        Save song to library
      </Button>
    </View>
  );
});

export { HomeScreen };
