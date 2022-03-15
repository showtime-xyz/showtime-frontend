import { useCallback, useMemo } from "react";

import { useAuth } from "app/hooks/auth/use-auth";
import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { NFT } from "app/types";

type FeedAPIResponse = Array<NFT>;

export const useFeed = () => {
  const { accessToken } = useAuth();

  const feedUrlFn = useCallback(
    (index) => {
      const url = `/v3/feed${accessToken ? "" : "/default"}?page=${
        index + 1
      }&limit=5`;
      return url;
    },
    [accessToken]
  );

  const queryState = useInfiniteListQuerySWR<FeedAPIResponse>(feedUrlFn);

  const newData = useMemo(() => {
    let newData: NFT[] = [];
    if (queryState.data) {
      newData = [...queryState.data.flat()];
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};
