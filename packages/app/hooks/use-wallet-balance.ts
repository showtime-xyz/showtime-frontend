import { useCallback } from "react";

import { createPublicClient, http } from "viem";
import { base, baseGoerli } from "viem/chains";

export const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_STAGE === "development" ? baseGoerli : base,
  transport: http(),
});

export const useWalletBalance = () => {
  const getBalance = useCallback(async (address: string) => {
    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    });

    return balance;
  }, []);

  return {
    getBalance,
  };
};
