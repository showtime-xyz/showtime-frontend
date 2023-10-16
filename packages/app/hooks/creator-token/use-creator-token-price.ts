import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const useContractPriceToBuyNext = (params: {
  address?: any;
  tokenAmount: number;
}) => {
  const res = useSWR(
    "priceToBuyNext" + params.address + params.tokenAmount,
    async () => {
      if (params.address) {
        const res: any = await publicClient.readContract({
          address: params.address,
          abi: creatorTokenAbi,
          functionName: "priceToBuyNext",
          args: [params.tokenAmount],
        });
        return {
          tokenPrice: res[0],
          creatorFee: res[0],
          adminFee: res[0],
        };
      }
    }
  );

  return res;
};
