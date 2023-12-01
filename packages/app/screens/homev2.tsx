import { withColorScheme } from "app/components/memo-with-theme";
import { useProfilePosts } from "app/components/profile/hooks/use-profile-posts";
import { VideoFeedList } from "app/components/video-feed";
import { useTrackPageViewed } from "app/lib/analytics";

export const HomeScreenV2 = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  const { data } = useProfilePosts("mio1984");
  return <VideoFeedList data={data} />;
});
