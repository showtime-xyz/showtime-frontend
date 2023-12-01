import { withColorScheme } from "app/components/memo-with-theme";
import { VideoFeedList } from "app/components/video-feed";
import { useHomePosts } from "app/hooks/use-home-posts";
import { useTrackPageViewed } from "app/lib/analytics";

export const HomeScreenV2 = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  const homePostsState = useHomePosts();
  return (
    <VideoFeedList
      data={homePostsState.data}
      onEndReached={homePostsState.fetchMore}
    />
  );
});
