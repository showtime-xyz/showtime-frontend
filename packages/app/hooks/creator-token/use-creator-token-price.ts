import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const getPriceToBuyNextKey = (params: {
  address?: any;
  tokenAmount: number;
}) => "priceToBuyNext" + params.address + params.tokenAmount;

export const useContractPriceToBuyNext = (params: {
  address?: any;
  tokenAmount: number;
}) => {
  const res = useSWR(getPriceToBuyNextKey(params), async () => {
    if (params.address) {
      const res: any = await publicClient.readContract({
        address: params.address,
        abi: creatorTokenAbi,
        functionName: "priceToBuyNext",
        args: [params.tokenAmount],
      });
      const totalPrice = res[0] + res[1] + res[2];
      return {
        tokenPrice: res[0],
        creatorFee: res[1],
        adminFee: res[2],
        totalPrice,
        displayPrice: (totalPrice / 1000000n).toString(),
      };
    }
  });

  return res;
};
