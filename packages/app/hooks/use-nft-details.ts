import useSWR from "swr";

import { NFT } from "app/types";

import { fetcher } from "./use-infinite-list-query";

export interface NFTDetailsPayload {
  data: NFT;
}

export function useNFTDetails(nftId: number) {
  const { data, error } = useSWR<NFTDetailsPayload>(
    "/v2/nft_detail/" + nftId,
    fetcher
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
