import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { Logger } from "app/lib/logger";
import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "../use-wallet";
import { getTotalCollectedKey } from "./use-contract-total-collected";
import { getPriceToBuyNextKey } from "./use-creator-token-price";

export const useCreatorTokenContractBuy = () => {
  const wallet = useWallet();
  const { mutate } = useSWRConfig();
  const state = useSWRMutation(
    "buyToken",
    async (
      _url: string,
      {
        arg,
      }: { arg: { contractAddress: any; maxPrice: BigInt; quantity: number } }
    ) => {
      if (arg.contractAddress) {
        let requestPayload: any;

        if (arg.quantity === 1) {
          const { request } = await publicClient.simulateContract({
            address: arg.contractAddress,
            account: wallet.address,
            abi: creatorTokenAbi,
            functionName: "buy",
            args: [arg.maxPrice],
          });
          requestPayload = request;
        } else {
          const { request } = await publicClient.simulateContract({
            address: arg.contractAddress,
            account: wallet.address,
            abi: creatorTokenAbi,
            functionName: "bulkBuy",
            args: [arg.quantity, arg.maxPrice],
          });
          console.log("bulk buy ", request);
          requestPayload = request;
        }

        Logger.log("simulate ", requestPayload);
        const hash = await wallet.walletClient?.writeContract?.(requestPayload);
        Logger.log("Buy transaction hash ", requestPayload);
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
