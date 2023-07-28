import useSWR from "swr";

import { NFT } from "app/types";

import { fetcher } from "./use-infinite-list-query";

export interface NFTDetailsPayload {
  data: NFT;
}

export function useNFTDetails(nftId?: number) {
  const { data, error, mutate } = useSWR<NFTDetailsPayload>(
    nftId ? "/v2/nft_detail/" + nftId : null,
    fetcher,
    {
      focusThrottleInterval: 30000,
      revalidateIfStale: false,
      dedupingInterval: 30000,
    }
  );

  return {
    data: data?.data,
    loading: !data,
    error,
    refresh: mutate,
  };
}
