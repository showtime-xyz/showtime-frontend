import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

import type { ChannelById } from "../types";

export const useChannelById = (channelId?: string) => {
  const queryState = useSWR<ChannelById>(
    channelId ? `/v1/channels/${channelId}` : null,
    fetcher
  );

  return {
    ...queryState,
  };
};
