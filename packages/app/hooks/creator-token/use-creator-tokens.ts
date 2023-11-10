import { useMemo, useCallback } from "react";

import useSWR from "swr";

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
export type TopCreatorTokenUser = {
  id: number;
  owner_profile?: Profile;
  owner_address: string;
  name: string;
  token_uri: string;
  nft_count: number;
};
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
export const useTopCreatorToken = (limit: number = 20) => {
  const fetchUrl = useCallback(
    (index: number, previousPageData: any) => {
      if (previousPageData && !previousPageData?.creator_tokens.length)
        return null;

      return `/v1/creator-token/top?page=${index + 1}&limit=${limit}`;
    },
    [limit]
  );

  const {
    data,
    fetchMore: fetchMoreData,
    ...queryState
  } = useInfiniteListQuerySWR<TopCreatorToken>(fetchUrl, {
    pageSize: limit,
  });

  const newData = useMemo(() => {
    let newData: TopCreatorToken["creator_tokens"] = [];
    if (data) {
      data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.creator_tokens);
        }
      });
    }
    return newData;
  }, [data]);

  const fetchMore = useCallback(() => {
    if (newData.length >= 100) return;
    fetchMoreData();
  }, [fetchMoreData, newData.length]);

  return {
    ...queryState,
    fetchMore,
    data: newData,
  };
};
