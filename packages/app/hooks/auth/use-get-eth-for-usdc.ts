import QuoterAbi from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";
import useSWR from "swr";

import { Logger } from "app/lib/logger";
import { publicClient } from "app/lib/wallet-public-client";

import {
  quoterv2Address,
  usdcAddress,
  wETHAddress,
} from "../creator-token/utils";

export const getETHForUSDC = (params?: { amount: bigint }) =>
  params ? "getETHForUSDC" + params.amount : "";

export const useGetETHForUSDC = (params?: { amount: bigint }) => {
  const res = useSWR(
    getETHForUSDC(params),
    async () => {
      if (params?.amount) {
        const req = {
          tokenIn: wETHAddress,
          tokenOut: usdcAddress,
          fee: 500,
          amount: params.amount + 500000n,
          sqrtPriceLimitX96: 0,
        };

        const res: any = await publicClient.readContract({
          address: quoterv2Address,
          abi: QuoterAbi.abi,
          functionName: "quoteExactOutputSingle",
          args: [req],
        });

        console.log("res ", res);
        return {
          value: res[0],
          displayValue: Number(res[0]) / (10 ^ 18),
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
