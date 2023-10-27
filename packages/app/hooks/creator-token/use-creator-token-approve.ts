import useSWRMutation from "swr/mutation";
import { baseGoerli, base } from "viem/chains";

import { Logger } from "app/lib/logger";
import { publicClient } from "app/lib/wallet-public-client";
import { isDEV } from "app/utilities";

import { useWallet } from "../use-wallet";
import { usdcAddress } from "./utils";

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
      const erc20Abi = require("app/abi/IERC20Permit.json");
      const walletClient = wallet.getWalletClient?.();

      const walletAddress = walletClient?.account?.address;
      if (walletAddress) {
        const { creatorTokenContract, maxPrice } = arg;
        const chain = isDEV ? baseGoerli : base;
        const res = (await publicClient?.readContract({
          address: usdcAddress,
          account: walletAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [walletAddress, creatorTokenContract],
        })) as unknown as bigint;
        Logger.log(
          "allowance and required price ",
          res,
          maxPrice,
          res < maxPrice
        );

        if (res < maxPrice) {
          const hash = await walletClient?.writeContract({
            address: usdcAddress,
            account: walletAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [creatorTokenContract, maxPrice],
            chain: chain,
          });
          Logger.log("approve transaction hash ", hash);
          if (hash) {
            const transaction = await publicClient.waitForTransactionReceipt({
              hash,
              pollingInterval: 2000,
              confirmations: 3,
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
