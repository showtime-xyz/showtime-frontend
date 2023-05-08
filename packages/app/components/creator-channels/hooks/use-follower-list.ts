import { useCallback } from "react";

import useSWR from "swr";

import {
  fetcher,
  useInfiniteListQuerySWR,
} from "app/hooks/use-infinite-list-query";

export interface UserItemType {
  img_url?: string;
  name?: string;
  profile_id: number;
  timestamp?: string;
  username?: string;
  verified?: boolean;
  wallet_address?: string;
  follows_you?: boolean;
}

export interface FollowData {
  data: {
    list: UserItemType[];
  };
}

const PAGE_SIZE = 20;

export function useCreatorChannelFollowersList(profileId?: number) {
  const channelsFetcher = useCallback(
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
      return `/v1/people?profile_id=${profileId}&want=followers&page=${
        index + 1
      }&limit=${PAGE_SIZE}`;
    },
    [profileId]
  );

  const queryState = useInfiniteListQuerySWR<UserItemType>(channelsFetcher, {
    pageSize: PAGE_SIZE,
  });

  return {
    ...queryState,
  };
}
