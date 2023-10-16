import useSWRMutation from "swr/mutation";
import { baseGoerli, base } from "viem/chains";

import { publicClient } from "app/lib/wallet-public-client";
import { isDEV } from "app/utilities";

import { useWallet } from "../use-wallet";

const usdcAddress = isDEV
  ? "0xF175520C52418dfE19C8098071a252da48Cd1C19"
  : "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const useApproveToken = () => {
  const wallet = useWallet();
  const state = useSWRMutation<boolean | undefined>(
    "approveToken",
    async function approveToken(
      _key: string,
      {
        arg,
      }: {
        arg: { creatorTokenContract: string; maxPrice: bigint };
      }
    ) {
      const { creatorTokenContract, maxPrice } = arg;
      if (wallet.address) {
        const chain = isDEV ? baseGoerli : base;
        try {
          await wallet?.walletClient?.switchChain({ id: chain.id });
        } catch (e: any) {
          if (e.code === 4902) {
            await wallet?.walletClient?.addChain({
              chain,
            });
          }
        }

        const res = (await publicClient?.readContract({
          address: usdcAddress,
          account: wallet.address,
          abi: require("app/abi/IERC20Permit.json"),
          functionName: "allowance",
          args: [wallet.address, creatorTokenContract],
        })) as unknown as bigint;

        if (res < maxPrice) {
          const hash = await wallet.walletClient?.writeContract({
            address: usdcAddress,
            account: wallet.address,
            abi: require("app/abi/IERC20Permit.json"),
            functionName: "approve",
            args: [creatorTokenContract, maxPrice],
            chain: chain,
          });
          if (hash) {
            const transaction = await publicClient.waitForTransactionReceipt({
              hash,
              pollingInterval: 2000,
            });
            if (transaction.status === "success") {
              return true;
            }
          }
        } else {
          return true;
        }
      }
    }
  );

  return state;
};
