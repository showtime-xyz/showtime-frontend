import { useCallback, useRef, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { VideoPost } from "app/types";

const PAGE_SIZE = 10;

export const useProfilePosts = (username?: string) => {
  let indexRef = useRef(0);
  const url = useCallback(
    (index: number) => {
      indexRef.current = index;
      return `v1/posts/profile/${username}?page=${
        index + 1
      }&limit=${PAGE_SIZE}`;
    },
    [username]
  );

  const queryState = useInfiniteListQuerySWR<VideoPost[]>(url, {
    pageSize: PAGE_SIZE,
  });

  const newData = useMemo(() => {
    let newData: VideoPost[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return {
    ...queryState,
    data: newData,
  };
};
