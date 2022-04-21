import useSWR from "swr";

import { Profile } from "app/types";

import { fetcher } from "./use-infinite-list-query";

export interface NFTDetailsPayload {
  data: Profile[];
}

export function useFollowSuggestions() {
  const { data, error } = useSWR<NFTDetailsPayload>(
    "/v1/get_follow_suggestions?recache=1",
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000 }
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
