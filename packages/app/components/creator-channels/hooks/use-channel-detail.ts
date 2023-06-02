import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

import { Channel } from "../types";

export const useChannelById = (channelId?: string) => {
  const queryState = useSWR<Channel>(
    channelId ? `/v1/channels/${channelId}` : null,
    fetcher
  );

  return {
    ...queryState,
  };
};
