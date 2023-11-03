import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { creatorTokenSwapRouterAbi } from "app/abi/CreatorTokenSwapRouterAbi";
import { getChannelByIdCacheKey } from "app/components/creator-channels/hooks/use-channel-detail";
import { getChannelMessageKey } from "app/components/creator-channels/hooks/use-channel-messages";
import { axios } from "app/lib/axios";
import { useLogInPromise } from "app/lib/login-promise";
import { captureException } from "app/lib/sentry";
import { publicClient } from "app/lib/wallet-public-client";
import { formatAPIErrorMessage } from "app/utilities";

import { toast } from "design-system/toast";

import { useUserProfile } from "../api-hooks";
import { useGetETHForUSDC } from "../auth/use-get-eth-for-usdc";
import { useWallet } from "../use-wallet";
import { getContractBalanceOfTokenKey } from "./use-balance-of-token";
import { getTotalCollectedKey } from "./use-contract-total-collected";
import { useApproveToken } from "./use-creator-token-approve";
import {
  getPriceToBuyNextKey,
  useCreatorTokenPriceToBuyNext,
} from "./use-creator-token-price-to-buy-next";
import { useMaxGasPrices } from "./use-max-gas-prices";
import { useSwitchChain } from "./use-switch-chain";
import {
  baseChain,
  creatorTokenSwapRouterAddress,
  isInsufficientFundsErrorFn,
} from "./utils";

export const useCreatorTokenBuy = (params: {
  username?: string;
  tokenAmount: number;
  paymentMethod: "USDC" | "ETH";
}) => {
  const { username, tokenAmount } = params;
  const { data: profileData } = useUserProfile({ address: username });
  const wallet = useWallet();
  const approveToken = useApproveToken();
  const { getMaxFeePerGasAndPriorityPrice } = useMaxGasPrices();
  const priceToBuyNext = useCreatorTokenPriceToBuyNext({
    address: profileData?.data?.profile.creator_token?.address,
    tokenAmount,
  });
  const ethPriceToBuyNext = useGetETHForUSDC(
    params.paymentMethod === "ETH"
      ? { amount: priceToBuyNext.data?.totalPrice }
      : undefined
  );

  const switchChain = useSwitchChain();
  const { mutate } = useSWRConfig();
  const { loginPromise } = useLogInPromise();

  const state = useSWRMutation(
    "buyCreatorToken",
    async () => {
      await loginPromise();

      if (wallet.isMagicWallet) {
        await wallet.disconnect();
        await wallet.connect();
      }

      const walletClient = wallet.getWalletClient?.();
      const walletAddress = walletClient?.account?.address;

      if (walletAddress && profileData?.data?.profile.creator_token) {
        const switchChainSuccess = await switchChain.trigger();

        const maxPrices = await getMaxFeePerGasAndPriorityPrice();

        if (maxPrices) {
          const { maxFeePerGas, maxPriorityFeePerGas } = maxPrices;

          console.log("gas price  buy", {
            maxFeePerGas,
            maxPriorityFeePerGas,
          });

          let transactionHash: `0x${string}` | undefined;
          let requestPayload: any;

          if (switchChainSuccess && maxFeePerGas) {
            if (params.paymentMethod === "ETH") {
              if (tokenAmount === 1) {
                const { request } = await publicClient.simulateContract({
                  // @ts-ignore
                  address: creatorTokenSwapRouterAddress,
                  account: walletAddress,
                  abi: creatorTokenSwapRouterAbi,
                  functionName: "buyWithEth",
                  value: ethPriceToBuyNext.data?.value,
                  args: [
                    profileData.data.profile.creator_token.address,
                    priceToBuyNext.data?.totalPrice + 500000n,
                  ],
                  chain: baseChain,
                });
                requestPayload = request;
                console.log("buy with eth request payload ", request);
              } else {
                const { request } = await publicClient.simulateContract({
                  // @ts-ignore
                  address: creatorTokenSwapRouterAddress,
                  account: walletAddress,
                  abi: creatorTokenSwapRouterAbi,
                  functionName: "bulkBuyWithEth",
                  value: ethPriceToBuyNext.data?.value,
                  args: [
                    profileData.data.profile.creator_token.address,
                    tokenAmount,
                    priceToBuyNext.data?.totalPrice + 500000n,
                  ],
                  chain: baseChain,
                });
                requestPayload = request;
                console.log("buy with eth bulk request payload ", request);
              }
            } else {
              // @ts-ignore
              const approveSuccess = await approveToken.trigger({
                creatorTokenContract:
                  profileData?.data?.profile.creator_token.address,
                // add 10 cents more to cover for weird fluctuation
                // TODO: remove if not needed after more testing
                maxPrice: priceToBuyNext.data?.totalPrice + 100000n,
              });
              if (approveSuccess) {
                if (tokenAmount === 1) {
                  const { request } = await publicClient.simulateContract({
                    address: profileData?.data?.profile.creator_token.address,
                    account: walletAddress,
                    abi: creatorTokenAbi,
                    functionName: "buy",
                    args: [priceToBuyNext.data?.totalPrice],
                    chain: baseChain,
                  });
                  requestPayload = request;
                  console.log("buy with usdc request payload ", request);
                } else {
                  const { request } = await publicClient.simulateContract({
                    address: profileData?.data?.profile.creator_token.address,
                    account: walletAddress,
                    abi: creatorTokenAbi,
                    functionName: "bulkBuy",
                    args: [tokenAmount, priceToBuyNext.data?.totalPrice],
                    chain: baseChain,
                  });
                  requestPayload = request;
                  console.log("buy bulk with usdc request payload ", request);
                }
              }
            }

            transactionHash = await walletClient?.writeContract?.({
              ...requestPayload,
              type: "eip1559",
              maxFeePerGas,
              maxPriorityFeePerGas,
            });
            console.log("buy transaction hash ", transactionHash);

            if (transactionHash) {
              const transaction = await publicClient.waitForTransactionReceipt({
                hash: transactionHash,
                pollingInterval: 2000,
                confirmations: 2,
              });

              if (transaction.status === "success") {
                mutate(
                  getTotalCollectedKey(
                    profileData?.data?.profile.creator_token.address
                  )
                );
                mutate(
                  getPriceToBuyNextKey({
                    address: profileData?.data?.profile.creator_token.address,
                    tokenAmount: 1,
                  })
                );

                mutate(
                  getContractBalanceOfTokenKey({
                    ownerAddress: walletAddress,
                    contractAddress:
                      profileData?.data?.profile.creator_token.address,
                  })
                );

                await axios({
                  url: "/v1/creator-token/poll-buy",
                  method: "POST",
                  data: {
                    creator_token_id: profileData.data.profile.creator_token.id,
                    quantity: tokenAmount,
                    tx_hash: transactionHash,
                  },
                });
                mutate(
                  (key: any) => {
                    const channelId = profileData.data?.profile.channels[0]?.id;
                    if (
                      typeof key === "string" &&
                      typeof channelId === "number" &&
                      (key.startsWith(getChannelByIdCacheKey(channelId)) ||
                        key.startsWith(getChannelMessageKey(channelId)))
                    ) {
                      return true;
                    }
                  },
                  undefined,
                  { revalidate: true }
                );
                return true;
              }
            }
          }
        }
      }
    },
    {
      onError: (error) => {
        {
          if (isInsufficientFundsErrorFn(error)) {
            toast.error(`Insufficient ${params.paymentMethod} balance`);
          } else {
            toast.error("Failed", {
              message: formatAPIErrorMessage(error),
            });
          }

          console.error("useCreatorTokenContractBuy", error);
          captureException(error);
        }
      },
    }
  );

  return state;
};
