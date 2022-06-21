import useSWR from "swr";

import { Activity } from "../components/nft-activity/nft-activity.types";
import { fetcher } from "./use-infinite-list-query";

export interface NFTDetailsPayload {
  data: {
    history: Activity[];
  };
}

const useNFTActivities = ({ nftId }: { nftId?: number }) => {
  const { data, error } = useSWR<NFTDetailsPayload>(
    nftId ? `/v1/nft_history/${nftId}` : null,
    fetcher
  );

  return { activities: data?.data?.history, loading: !data, error };
};

export default useNFTActivities;
