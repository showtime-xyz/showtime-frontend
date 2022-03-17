import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";

export interface AllSeller {
  profile_id: number;
  sale_contract: string;
  sale_identifier: number;
  quantity: number;
}

export interface Listing {
  total_edition_quantity: number;
  quantity: number;
  min_price: number;
  currency: string;
  sale_identifier: number;
  profile_id: number;
  username: string;
  name: string;
  verified: number;
  address: string;
  img_url: string;
  royalty_percentage: string;
  listing_created: Date;
  sale_contract: string;
  all_sellers: AllSeller[];
}

export interface CardSummary {
  nft_id: number;
  contract_address: string;
  listing?: Listing;
}

interface Data {
  card_summary: CardSummary[];
}

export interface NFTListingsPayload {
  data: Data;
}

export function useNFTListings(nftId?: number) {
  const { data, error } = useSWR<NFTListingsPayload>(
    nftId ? "/v1/nft_listings/" + nftId : null,
    fetcher
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
