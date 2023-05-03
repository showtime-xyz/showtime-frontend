import { useCallback, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";

export type CreatorChannel = {
  // todo: add props
};

const PAGE_SIZE = 10;

export const useChannelsList = () => {
  // TODO: add real endpoint
  const channelsFetcher = useCallback((index: number, previousPageData: []) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/v1/payments?page=${index + 1}&limit=${PAGE_SIZE}`;
  }, []);

  const queryState = useInfiniteListQuerySWR<CreatorChannel[]>(
    channelsFetcher,
    {
      pageSize: PAGE_SIZE,
    }
  );
  const newData = useMemo(() => {
    let newData: CreatorChannel[] = [];
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
