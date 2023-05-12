import useSWR from "swr";

import { GatingType, IEdition } from "app/types";

import { fetcher } from "./use-infinite-list-query";

interface Winner {
  profile_id: number;
  wallet_address: string;
  username: string;
  ens_domain: string;
  twitter_username: string;
  instagram_username: string;
}

interface Raffle {
  id: number;
  created_at: string;
  updated_at: string;
  concluded_at: string;
  winner?: Winner;
}
export type CreatorEditionResponse = {
  creator_airdrop_edition: IEdition;
  is_already_claimed: boolean;
  password: string | null;
  time_limit: string;
  total_claimed_count: number;
  creator_spotify_id?: string;
  creator_apple_music_id?: string;
  gating_type: GatingType;
  spotify_track_name: string | null;
  spotify_track_url: string | null;
  apple_music_track_name: string | null;
  apple_music_track_url: string | null;
  spinamp_track_url: string | null; // this will be removed after the airdrop
  presave_release_date: string | null;
  raffles?: Raffle[];
};

export function useCreatorCollectionDetail(editionAddress?: string) {
  const { data, error, mutate } = useSWR<CreatorEditionResponse>(
    editionAddress
      ? "/v1/creator-airdrops/edition?edition_address=" + editionAddress
      : null,
    fetcher,
    { focusThrottleInterval: 300000, revalidateIfStale: false }
  );

  return {
    data,
    loading: !data,
    error,
    mutate,
  };
}
