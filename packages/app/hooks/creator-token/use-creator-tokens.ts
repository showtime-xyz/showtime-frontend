import { useMemo, useCallback, useRef } from "react";

import useSWR from "swr";

import {
  ChannelMessage,
  ChannelPermissions,
} from "app/components/creator-channels/types";
import {
  fetcher,
  useInfiniteListQuerySWR,
} from "app/hooks/use-infinite-list-query";
import { Profile } from "app/types";

export type CreatorTokenUser = {
  verified: boolean;
  bio: string | null;
  profile_id: number;
  name: string;
  username: string;
  wallet_address: string;
  wallet_address_nonens: string;
  img_url: string;
};
export type CreatorTokenItem = {
  id: number;
  owner_profile?: Profile;
  owner_address: string;
  name: string;
  token_uri: string;
  nft_count: number;
  channel_id: number;
};
export type NewCreatorTokenItem = {
  creator_token: CreatorTokenItem;
  last_channel_message: ChannelMessage;
  permissions: ChannelPermissions;
};
export type TopCreatorTokenUser = NewCreatorTokenItem | CreatorTokenItem;

export type CreatorTokenCollectors = {
  profiles: CreatorTokenUser[];
};
export type TopCreatorToken = {
  creator_tokens: TopCreatorTokenUser[];
};
export const useCreatorTokenCollectors = (
  creatorTokenId?: number | string,
  limit?: number
) => {
  const { data, isLoading, mutate, error } = useSWR<CreatorTokenCollectors>(
    creatorTokenId
      ? `/v1/creator-token/collectors?creator_token_id=${creatorTokenId}`
      : "",
    fetcher,
    { revalidateOnFocus: false }
  );
  const newData = useMemo(() => {
    if (limit) {
      return data?.profiles.slice(0, limit);
    }
    return data?.profiles;
  }, [data, limit]);

  return {
    data: newData,
    count: data?.profiles.length || 0,
    isLoading,
    mutate,
    error,
  };
};

export const useCreatorTokenCoLlected = (
  profileId?: number | string,
  limit?: number
) => {
  const { data, isLoading, mutate, error } = useSWR<CreatorTokenCollectors>(
    profileId ? `/v1/creator-token/collected?profile_id=${profileId}` : "",
    fetcher,
    { revalidateOnFocus: false }
  );
  const newData = useMemo(() => {
    if (limit) {
      return data?.profiles.slice(0, limit);
    }
    return data?.profiles;
  }, [data, limit]);

  return {
    data: newData,
    count: data?.profiles.length || 0,
    isLoading,
    mutate,
    error,
  };
};
export const useTopCreatorToken = (limit = 20) => {
  let indexRef = useRef(0);
  const url = useCallback(
    (index: number) => {
      indexRef.current = index;
      return `/v1/creator-token/top?page=${index + 1}&limit=${limit}`;
    },
    [limit]
  );

  const queryState = useInfiniteListQuerySWR<TopCreatorToken>(url, {
    pageSize: limit,
  });

  const newData = useMemo(() => {
    let newData: TopCreatorToken["creator_tokens"] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.creator_tokens);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  const fetchMore = () => {
    if (
      queryState.data &&
      queryState.data[queryState.data.length - 1].creator_tokens.length === 0
    ) {
      return;
    }

    return queryState.fetchMore();
  };

  return {
    ...queryState,
    data: newData,
    fetchMore,
  };
};
