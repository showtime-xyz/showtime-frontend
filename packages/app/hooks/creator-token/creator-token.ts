import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "../use-wallet";

export const useContractPriceToBuyNext = (
  address: `0x${string}`,
  tokenAmount: number
) => {
  const res = useSWR("priceToBuyNext", () => {
    return publicClient.readContract({
      address,
      abi: creatorTokenAbi,
      functionName: "priceToBuyNext",
      args: [tokenAmount],
    });
  });

  return res;
};

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

export const useContractSellToken = ({
  contractAddress,
  tokenId,
}: {
  contractAddress: any;
  tokenId: any;
}) => {
  const wallet = useWallet();
  const state = useSWRMutation("sellToken", async () => {
    if (wallet.address) {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        account: wallet.address,
        abi: creatorTokenAbi,
        functionName: "sell",
        args: [tokenId],
      });

      return wallet.walletClient?.writeContract?.(request);
    }
  });

  return state;
};
