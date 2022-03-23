import { useCallback, useMemo } from "react";

import { useAuth } from "app/hooks/auth/use-auth";
import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { NFT } from "app/types";

type FeedAPIResponse = Array<NFT>;

export const useFeed = () => {
  const { accessToken } = useAuth();

  const feedUrlFn = useCallback(
    (index) => {
      const url = `/v3/feed${accessToken ? "" : "/default"}?offset=${
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
      queryState.data.forEach((p) => {
        // filter if duplicate data shows up in pagingation.
        // It can happen if database is updating and we are fetching new data.
        // As new post shows on top, fetching next page can have same post as previous page.
        // TODO: Cursor based pagination in API?
        const uniquePage = p.filter((d) => {
          const found = newData.find((n) => n.nft_id === d.nft_id);
          if (found) {
            return false;
          }
          return true;
        });

        newData = newData.concat(uniquePage);
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};
