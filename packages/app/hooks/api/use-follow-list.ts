import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";

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

interface FollowData {
  data: {
    list: UserItemType[];
  };
}

export function useFollowersList(profileId?: number) {
  const { data, error } = useSWR<FollowData>(
    profileId
      ? "/v1/people?want=followers&limit=500&profile_id=" + profileId
      : null,
    fetcher
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}

export function useFollowingList(profileId?: number) {
  const { data, error } = useSWR<FollowData>(
    profileId
      ? "/v1/people?want=following&limit=500&profile_id=" + profileId
      : null,
    fetcher
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
