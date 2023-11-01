import useSWR from "swr";

import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "./use-wallet/use-wallet";

export const useWalletETHBalance = () => {
  const wallet = useWallet();
  const res = useSWR("ethBalance" + wallet.address, async () => {
    if (wallet.address) {
      const res = (await publicClient.getBalance({
        address: wallet.address,
      })) as bigint;
      return {
        balance: res,
        displayBalance: (Number(res) / 10 ** 18).toFixed(6).toString(),
      };
    }
  });

  return res;
};
