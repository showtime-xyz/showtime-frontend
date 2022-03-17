import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";

export interface FollowingUser {
  img_url?: string;
  name?: string;
  profile_id: number;
  timestamp: string;
  username?: null;
  verified: 0 | 1;
  wallet_address?: string;
}

interface FollowingData {
  data: {
    list: FollowingUser[];
  };
}

export function useFollowingList(profileId?: number) {
  const { data, error } = useSWR<FollowingData>(
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
