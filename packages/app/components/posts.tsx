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
  const { data } = useProfilePosts(username);
  const postIndex = data?.findIndex((d) => d.id === postId);
  const initialScrollIndex = postIndex === -1 ? 0 : postIndex;
  if (data) {
    return (
      <VideoFeedList data={data} initialScrollIndex={initialScrollIndex} />
    );
  }
};
