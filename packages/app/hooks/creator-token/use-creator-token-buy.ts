import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "../use-wallet";

export const useContractBuyToken = ({
  contractAddress,
  maxPrice,
}: {
  contractAddress: any;
  maxPrice: any;
}) => {
  const wallet = useWallet();
  const state = useSWRMutation("buyToken", async () => {
    if (wallet.address) {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        account: wallet.address,
        abi: creatorTokenAbi,
        functionName: "buy",
        args: [maxPrice],
      });

      return wallet.walletClient?.writeContract?.(request);
    }
  });

  return state;
};
