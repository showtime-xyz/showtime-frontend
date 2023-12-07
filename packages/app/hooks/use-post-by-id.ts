import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";
import { VideoPost } from "app/types";

export const usePostById = (postId?: string) => {
  const queryState = useSWR<VideoPost>(
    postId ? `/v1/posts/${postId}` : null,
    fetcher
  );

  return queryState;
};
