import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { Home } from "app/components/home";
import { withColorScheme } from "app/components/memo-with-theme";
import { VideoFeedList } from "app/components/video-feed";
import { useHomePosts } from "app/hooks/use-home-posts";
import { useTrackPageViewed } from "app/lib/analytics";

export const HomeScreenV2 = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  const homePostsState = useHomePosts();
  return (
    <View tw="flex-1 flex-row">
      <View tw="flex-[3]">
        <VideoFeedList
          data={homePostsState.data}
          onEndReached={homePostsState.fetchMore}
          isLoading={homePostsState.isLoading}
          isLoadingMore={homePostsState.isLoadingMore}
        />
      </View>
      {Platform.OS === "web" ? (
        <View tw="hidden h-full flex-[1.3] lg:flex">
          <Home />
        </View>
      ) : null}
    </View>
  );
});
