import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

import type { ChannelById } from "../types";

export const getChannelByIdCacheKey = (channelId: string | number) => {
  return `/v1/channels/${channelId}`;
};

export const useChannelById = (channelId?: string | number) => {
  const queryState = useSWR<ChannelById>(
    channelId ? getChannelByIdCacheKey(channelId) : null,
    fetcher,
    {
      focusThrottleInterval: 5000,
      dedupingInterval: 5000,
      revalidateIfStale: false,
    }
  );

  return queryState;
};
