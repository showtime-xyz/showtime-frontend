import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const getTotalCollectedKey = (contractAddress: string) =>
  "totalSupply" + contractAddress;

export const useContractTotalCollected = (params: {
  contractAddress?: any;
}) => {
  const res = useSWR(getTotalCollectedKey(params.contractAddress), async () => {
    if (params.contractAddress) {
      return publicClient.readContract({
        address: params.contractAddress,
        abi: creatorTokenAbi,
        functionName: "totalSupply",
      }) as Promise<bigint>;
    }
  });

  return res;
};
