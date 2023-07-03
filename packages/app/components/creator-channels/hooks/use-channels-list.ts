import { useCallback, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { useUser } from "app/hooks/use-user";

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
  const { isAuthenticated } = useUser();
  const channelsFetcher = useCallback(
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
      return isAuthenticated
        ? `/v1/channels/joined?page=${index + 1}&limit=${PAGE_SIZE}`
        : "";
    },
    [isAuthenticated]
  );

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

export const useSuggestedChannelsList = (params?: { pageSize?: number }) => {
  const pageSize = params?.pageSize || PAGE_SIZE;
  const channelsFetcher = useCallback(
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
      return `/v1/channels/suggested?page=${index + 1}&limit=${pageSize}`;
    },
    [pageSize]
  );

  const queryState = useInfiniteListQuerySWR<CreatorChannel[]>(
    channelsFetcher,
    {
      pageSize,
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
