import { useCallback } from "react";

import { publicClient } from "app/lib/wallet-public-client";

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
