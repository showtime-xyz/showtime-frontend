import useSWRMutation from "swr/mutation";
import { baseGoerli, base } from "viem/chains";

import { publicClient } from "app/lib/wallet-public-client";
import { isDEV } from "app/utilities";

import { useWallet } from "../use-wallet";
import { useMaxGasPrices } from "./use-max-gas-prices";
import { usdcAddress } from "./utils";

export const useApproveToken = () => {
  const wallet = useWallet();
  const { getMaxFeePerGasAndPriorityPrice } = useMaxGasPrices();
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
      const walletClient = await wallet.getWalletClient?.();

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
        console.log(
          "allowance and required price ",
          res,
          maxPrice,
          res < maxPrice
        );

        if (res >= maxPrice) {
          return true;
        }

        const maxPrices = await getMaxFeePerGasAndPriorityPrice();

        if (maxPrices) {
          const { maxFeePerGas, maxPriorityFeePerGas } = maxPrices;

          console.log("gas price  approve", {
            maxFeePerGas,
            maxPriorityFeePerGas,
          });
          const { request } = await publicClient.simulateContract({
            address: usdcAddress,
            account: walletAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [creatorTokenContract, maxPrice],
            chain: chain,
          });

          //@ts-ignore
          const hash = await walletClient?.writeContract({
            ...request,
            maxFeePerGas,
            maxPriorityFeePerGas,
          });
          console.log("approve transaction hash ", hash);
          if (hash) {
            const transaction = await publicClient.waitForTransactionReceipt({
              hash,
              pollingInterval: 2000,
              confirmations: 2,
            });
            if (transaction.status === "success") {
              return true;
            }
          }
        }
      }
    }
  );

  return state;
};
