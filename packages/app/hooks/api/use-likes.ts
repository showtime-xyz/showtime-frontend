import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";

export interface Liker {
  profile_id: number;
  verified: number;
  wallet_address: string;
  name: string;
  img_url: string;
  timestamp: Date;
  username: string;
}

export interface Data {
  likers: Liker[];
}

interface LikesPayload {
  data: Data;
}

export function useLikes(nftId?: number) {
  const { data, error } = useSWR<LikesPayload>(
    nftId ? "/v1/likes/" + nftId : null,
    fetcher
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
