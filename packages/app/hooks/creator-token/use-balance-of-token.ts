import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const useContractBalanceOfToken = (params: {
  ownerAddress?: any;
  contractAddress?: any;
}) => {
  const res = useSWR("balanceOfToken", () => {
    if (params.ownerAddress && params.contractAddress) {
      return publicClient.readContract({
        address: params.contractAddress,
        abi: creatorTokenAbi,
        functionName: "balanceOf",
        args: [params.ownerAddress],
      }) as Promise<bigint>;
    }
  });

  return res;
};
