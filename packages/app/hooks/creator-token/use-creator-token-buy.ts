import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "../use-wallet";

export const useContractBuyToken = () => {
  const wallet = useWallet();
  const state = useSWRMutation(
    "buyToken",
    async (
      _url: string,
      { arg }: { arg: { contractAddress: any; maxPrice: BigInt } }
    ) => {
      if (arg.contractAddress) {
        const { request } = await publicClient.simulateContract({
          address: arg.contractAddress,
          account: wallet.address,
          abi: creatorTokenAbi,
          functionName: "buy",
          args: [arg.maxPrice],
        });

        return wallet.walletClient?.writeContract?.(request);
      }
    }
  );

  return state;
};
