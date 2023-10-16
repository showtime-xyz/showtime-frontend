import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { Logger } from "app/lib/logger";
import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "../use-wallet";
import { getTotalCollectedKey } from "./use-contract-total-collected";
import { getPriceToBuyNextKey } from "./use-creator-token-price";

export const useContractBuyToken = () => {
  const wallet = useWallet();
  const { mutate } = useSWRConfig();
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

        Logger.log("simulate ", request);
        const hash = await wallet.walletClient?.writeContract?.(request);
        Logger.log("Buy transaction hash ", request);
        if (hash) {
          await publicClient.waitForTransactionReceipt({
            hash,
            pollingInterval: 2000,
          });

          mutate(getTotalCollectedKey(arg.contractAddress));
          mutate(
            getPriceToBuyNextKey({
              address: arg.contractAddress,
              tokenAmount: 1,
            })
          );

          return hash;
        }
      }
    }
  );

  return state;
};
