import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

export type ChannelReaction = {
  channel: string | null;
  id: number;
  reaction: string;
};
export type ChannelReactionResponse = Array<ChannelReaction>;

export const useChannelReactions = (channelId?: string) => {
  const state = useSWR<ChannelReactionResponse>(
    channelId ? `/v1/channels/${channelId}/reactions` : null,
    fetcher
  );

  return state;
};
