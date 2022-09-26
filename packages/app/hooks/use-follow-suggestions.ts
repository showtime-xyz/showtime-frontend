import useSWR from "swr";

import { Creator } from "app/types";

import { fetcher } from "./use-infinite-list-query";

export interface NFTDetailsPayload {
  data: Creator[];
}

export function useFollowSuggestions() {
  const { data, error } = useSWR<NFTDetailsPayload>(
    "/v2/follow-suggestions",
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000 }
  );

  return {
    data: data,
    loading: !data,
    error,
  };
}
