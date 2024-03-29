import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const getPriceToBuyNextKey = (params?: {
  address?: any;
  tokenAmount: number;
}) => (params ? "priceToBuyNext" + params.address + params.tokenAmount : "");

export const useCreatorTokenPriceToBuyNext = (params?: {
  address?: any;
  tokenAmount: number;
}) => {
  const res = useSWR(
    getPriceToBuyNextKey(params),
    async () => {
      if (params?.address) {
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
          displayPrice: (Number(totalPrice) / 1000000).toFixed(2).toString(),
        };
      }
    },
    {
      refreshInterval: 10_000,
      revalidateOnMount: true,
    }
  );

  return res;
};
