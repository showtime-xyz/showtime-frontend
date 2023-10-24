import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { getChannelByIdCacheKey } from "app/components/creator-channels/hooks/use-channel-detail";
import { getChannelMessageKey } from "app/components/creator-channels/hooks/use-channel-messages";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { publicClient } from "app/lib/wallet-public-client";
import { formatAPIErrorMessage } from "app/utilities";

import { toast } from "design-system/toast";

import { useUserProfile } from "../api-hooks";
import { useWallet } from "../use-wallet";
import { getTotalCollectedKey } from "./use-contract-total-collected";
import { useApproveToken } from "./use-creator-token-approve";
import {
  getPriceToBuyNextKey,
  useCreatorTokenPriceToBuyNext,
} from "./use-creator-token-price-to-buy-next";
import { useSwitchChain } from "./use-switch-chain";
import { baseChain } from "./utils";

export const useCreatorTokenBuy = (params: {
  username?: string;
  tokenAmount: number;
}) => {
  const { username, tokenAmount } = params;
  const { data: profileData } = useUserProfile({ address: username });
  const wallet = useWallet();
  const approveToken = useApproveToken();
  const priceToBuyNext = useCreatorTokenPriceToBuyNext({
    address: profileData?.data?.profile.creator_token?.address,
    tokenAmount,
  });
  const switchChain = useSwitchChain();
  const { mutate } = useSWRConfig();

  const state = useSWRMutation(
    "buyCreatorToken",
    async () => {
      if (wallet.isMagicWallet) {
        await wallet.disconnect();
        await wallet.connect();
      }

      if (wallet.address && profileData?.data?.profile.creator_token) {
        await switchChain.trigger();
        // @ts-ignore
        const result = await approveToken.trigger({
          creatorTokenContract:
            profileData?.data?.profile.creator_token.address,
          maxPrice: priceToBuyNext.data?.totalPrice,
        });
        if (result) {
          let requestPayload: any;

          if (tokenAmount === 1) {
            const { request } = await publicClient.simulateContract({
              address: profileData?.data?.profile.creator_token.address,
              account: wallet.address,
              abi: creatorTokenAbi,
              functionName: "buy",
              args: [priceToBuyNext.data?.totalPrice],
              chain: baseChain,
            });
            requestPayload = request;
          } else {
            const { request } = await publicClient.simulateContract({
              address: profileData?.data?.profile.creator_token.address,
              account: wallet.address,
              abi: creatorTokenAbi,
              functionName: "bulkBuy",
              args: [tokenAmount, priceToBuyNext.data?.totalPrice],
              chain: baseChain,
            });
            console.log("bulk buy ", request);
            requestPayload = request;
          }

          Logger.log("simulate ", requestPayload);
          const transactionHash = await wallet.walletClient?.writeContract?.(
            requestPayload
          );
          Logger.log("Buy transaction hash ", requestPayload);
          if (transactionHash) {
            const transaction = await publicClient.waitForTransactionReceipt({
              hash: transactionHash,
              pollingInterval: 2000,
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
        } else {
          toast.error("Failed", {
            message: "Approve transaction failed",
          });
        }
      }
    },
    {
      onError: (error) => {
        {
          Logger.error("useCreatorTokenContractBuy", error);
          toast.error("Failed", {
            message: formatAPIErrorMessage(error),
          });
        }
      },
    }
  );

  return state;
};
