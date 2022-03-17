import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";

export interface FollowerUser {
  img_url?: string;
  name?: string;
  profile_id: number;
  timestamp: string;
  username?: null;
  verified: 0 | 1;
  wallet_address?: string;
}

interface FollowersData {
  data: {
    list: FollowerUser[];
  };
}

export function useFollowersList(profileId?: number) {
  const { data, error } = useSWR<FollowersData>(
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
