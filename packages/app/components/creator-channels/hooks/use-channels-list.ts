import { useCallback, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";

import { Channel } from "../types";

export type CreatorChannel = Omit<
  Channel,
  "latest_message_updated_at" | "latest_message"
>;

const PAGE_SIZE = 15;

export const useOwnedChannelsList = () => {
  const channelsFetcher = useCallback((index: number, previousPageData: []) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/v1/channels/owned?page=1&limit=1`; // hardcode for now
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

export const useJoinedChannelsList = () => {
  const channelsFetcher = useCallback((index: number, previousPageData: []) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/v1/channels/joined?page=${index + 1}&limit=${PAGE_SIZE}`;
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

const SUGGESTED_PAGE_SIZE = 15;
export const useSuggestedChannelsList = () => {
  const channelsFetcher = useCallback((index: number, previousPageData: []) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/v1/channels/suggested?page=${
      index + 1
    }&limit=${SUGGESTED_PAGE_SIZE}`;
  }, []);

  const queryState = useInfiniteListQuerySWR<CreatorChannel[]>(
    channelsFetcher,
    {
      pageSize: SUGGESTED_PAGE_SIZE,
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
