import useSWR from "swr";

import { IEdition } from "app/types";

import { fetcher } from "./use-infinite-list-query";

export type CreatorEditionResponse = {
  creator_airdrop_edition: IEdition;
  is_already_claimed: boolean;
  time_limit: string;
  total_claimed_count: number;
  gating_type: "spotify_save" | "password" | "location" | "multi";
  spotify_track_name: string | null;
  spotify_track_url: string | null;
};

export function useCreatorCollectionDetail(editionAddress?: string) {
  const { data, error, mutate } = useSWR<CreatorEditionResponse>(
    editionAddress
      ? "/v1/creator-airdrops/edition?edition_address=" + editionAddress
      : null,
    fetcher
  );

  return {
    data,
    loading: !data,
    error,
    mutate,
  };
}
