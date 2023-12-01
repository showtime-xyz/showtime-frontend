import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";
import { VideoPost } from "app/types";

export const getProfilePostByUsername = (username: string) => {
  return `/v1/posts/profile/${username}`;
};

export const useProfilePosts = (username?: string) => {
  const queryState = useSWR<VideoPost[]>(
    username ? getProfilePostByUsername(username) : null,
    fetcher
  );

  return queryState;
};
