import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { publicClient } from "app/lib/wallet-public-client";

import { useWallet } from "../use-wallet";

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
