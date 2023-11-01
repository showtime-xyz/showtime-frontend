import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

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

export const useCreatorTokenCollectors = (creatorTokenId?: number) => {
  const { data, isLoading, mutate, error } = useSWR<CreatorTokenCollectors>(
    creatorTokenId
      ? `/v1/creator-token/collectors?creator_token_id=${creatorTokenId}`
      : "",
    fetcher,
    { revalidateOnFocus: false }
  );

  return { data: data, isLoading, mutate, error };
};

export const useCreatorTokenCoLlected = (profileId?: number) => {
  const { data, isLoading, mutate, error } = useSWR<CreatorTokenCollectors>(
    profileId ? `/v1/creator-token/collected?profile_id=${profileId}` : "",
    fetcher,
    { revalidateOnFocus: false }
  );

  return { data: data, isLoading, mutate, error };
};
