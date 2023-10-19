import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

export const getPriceToSellNextKey = (params?: {
  address?: any;
  tokenAmount?: number;
}) => (params ? "priceToSellNext" + params.address + params.tokenAmount : null);

export const useCreatorTokenPriceToSellNext = (params?: {
  address?: any;
  tokenAmount?: number;
}) => {
  const res = useSWR(
    getPriceToSellNextKey(params),
    async () => {
      if (params?.address && params.tokenAmount) {
        const res: any = await publicClient.readContract({
          address: params.address,
          abi: creatorTokenAbi,
          functionName: "priceToSellNext",
          args: [params.tokenAmount],
        });
        const totalPrice = res[0] - res[1] - res[2];
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
