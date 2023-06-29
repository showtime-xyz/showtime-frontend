import { useCallback, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";

const PAGE_SIZE = 30;

export type ChannelMember = {
  id: number;
  admin: boolean;
  created_at: string;
  updated_at: string;
  profile: {
    username: string;
    verified: boolean;
    bio: string | null;
    profile_id: number;
    name: string;
    wallet_address: string;
    wallet_address_nonens: string;
    img_url: string;
  };
};

export const useChannelMembers = (channelId?: string) => {
  const membersUrl = useCallback(
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
      if (channelId) {
        //return `/v1/channels/${channelId}/members`;
        return `/v1/channels/${channelId}/members?page=${
          index + 1
        }&limit=${PAGE_SIZE}`;
      } else {
        return null;
      }
    },
    [channelId]
  );

  const queryState = useInfiniteListQuerySWR<ChannelMember[]>(membersUrl, {
    pageSize: PAGE_SIZE,
  });
  const newData = useMemo(() => {
    let newData: ChannelMember[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  const membersCount = useMemo(() => {
    return newData.length ?? 0;
  }, [newData]);

  return {
    ...queryState,
    membersCount,
    data: newData,
  };
};
