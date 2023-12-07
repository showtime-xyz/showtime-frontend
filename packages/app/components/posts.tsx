import { createParam } from "app/navigation/use-param";

import { useProfilePosts } from "./profile/hooks/use-profile-posts";
import { VideoFeedList } from "./video-feed";

type Query = {
  type: "profilePosts";
  username?: string;
  postId?: string;
};

const { useParam } = createParam<Query>();
export const Posts = () => {
  const [type] = useParam("type");
  if (type === "profilePosts") {
    return <ProfilePosts />;
  }

  return null;
};

const ProfilePosts = () => {
  const [username] = useParam("username");
  const [postId] = useParam("postId");
  const profilePostsState = useProfilePosts(username);
  const postIndex = profilePostsState.data?.findIndex((d) => d.id === postId);
  const initialScrollIndex = postIndex === -1 ? 0 : postIndex;
  if (profilePostsState.data) {
    return (
      <VideoFeedList
        data={profilePostsState.data}
        initialScrollIndex={initialScrollIndex}
        onEndReached={profilePostsState.fetchMore}
      />
    );
  }
};
