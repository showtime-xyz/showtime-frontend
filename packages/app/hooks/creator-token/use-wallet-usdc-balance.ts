import useSWR from "swr";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "../use-wallet";
import { usdcAddress } from "./utils";

export const useWalletUSDCBalance = () => {
  const wallet = useWallet();
  const res = useSWR("usdcBalance" + wallet.address, async () => {
    if (wallet.address) {
      return publicClient.readContract({
        address: usdcAddress,
        abi: creatorTokenAbi,
        functionName: "balanceOf",
        args: [wallet.address],
      });
    }
  });

  return res;
};
