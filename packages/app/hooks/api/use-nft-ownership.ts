import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";

export interface NFTOwner {
  profile_id: number;
  name: string;
  img_url: string;
  quantity: number;
  username: string;
  verified: number;
  address: string;
  wallet_address: string;
}

export interface Data {
  creator_bio: string;
  token_created: Date;
  token_last_transferred: Date;
  multiple_owners_list: NFTOwner[];
  owner_count: number;
  token_quantity: number;
}

export interface NFTOwnershipPayload {
  data: Data;
}

export function useNFTOwnership(nftId: number) {
  const { data, error } = useSWR<NFTOwnershipPayload>(
    "/v1/nft_detail/" + nftId,
    fetcher
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
}
