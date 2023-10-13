import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const useContractPriceToBuyNext = (
  address: `0x${string}`,
  tokenAmount: number
) => {
  const res = useSWR("priceToBuyNext", () => {
    return publicClient.readContract({
      address,
      abi: creatorTokenAbi,
      functionName: "priceToBuyNext",
      args: [tokenAmount],
    });
  });

  return res;
};
