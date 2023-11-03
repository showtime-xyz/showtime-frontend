import { useMemo, useCallback } from "react";

import useSWR from "swr";

import {
  fetcher,
  useInfiniteListQuerySWR,
} from "app/hooks/use-infinite-list-query";

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
export type CreatorTokenCollectors = {
  profiles: CreatorTokenUser[];
};
export type TopCreatorToken = {
  creator_tokens: CreatorTokenUser[];
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
export const useTopCreatorToken = (limit: number = 10) => {
  const fetchUrl = useCallback(
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
      return `/v1/creator-token/collectors?page=${
        index + 1
      }&limit=${limit}&creator_token_id=${27}`;
    },
    [limit]
  );

  const queryState = useInfiniteListQuerySWR<CreatorTokenCollectors>(fetchUrl, {
    pageSize: limit,
  });
  const newData = useMemo(() => {
    let newData: CreatorTokenUser[] = [];
    if (queryState.data && queryState.data[0] && queryState.data[0].profiles) {
      queryState.data[0].profiles.forEach((p) => {
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
