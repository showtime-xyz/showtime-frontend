import { useCallback, useRef, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { axios } from "app/lib/axios";
import { VideoPost } from "app/types";

const PAGE_SIZE = 3;

export const useHomePosts = () => {
  let indexRef = useRef(0);
  const url = useCallback((index: number) => {
    indexRef.current = index;
    return `v1/posts/feed?page=${index + 1}&limit=${PAGE_SIZE}`;
  }, []);

  const queryState = useInfiniteListQuerySWR<VideoPost[]>(url, {
    pageSize: PAGE_SIZE,
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnFocus: false,
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

    return newData.filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
    );
  }, [queryState.data]);

  return {
    ...queryState,
    data: newData,
  };
};
