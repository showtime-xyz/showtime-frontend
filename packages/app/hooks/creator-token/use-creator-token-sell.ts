import { useContext } from "react";

import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { creatorTokenAbi } from "app/abi/CreatorTokenAbi";
import { UserContext } from "app/context/user-context";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { useLogInPromise } from "app/lib/login-promise";
import { publicClient } from "app/lib/wallet-public-client";
import { formatAPIErrorMessage } from "app/utilities";

import { toast } from "design-system/toast";

import { useWallet } from "../use-wallet";
import { getTotalCollectedKey } from "./use-contract-total-collected";
import { getPriceToBuyNextKey } from "./use-creator-token-price-to-buy-next";
import { useSwitchChain } from "./use-switch-chain";
import { baseChain } from "./utils";

export const useCreatorTokenSell = () => {
  const wallet = useWallet();
  const Alert = useAlert();
  const switchChain = useSwitchChain();
  const { mutate } = useSWRConfig();
  const user = useContext(UserContext);
  const { loginPromise } = useLogInPromise();
  const state = useSWRMutation(
    "sellToken",
    async (
      _key: string,
      {
        arg,
      }: {
        arg: {
          contractAddress: any;
          creatorTokenId: number;
          quantity: number;
        };
      }
    ) => {
      await loginPromise();

      if (wallet.isMagicWallet) {
        await wallet.disconnect();
        await wallet.connect();
      }

      const tokenIdsRes = await axios({
        url:
          "/v1/creator-token/sell/token-ids?creator_token_id=" +
          arg.creatorTokenId,
        method: "GET",
      });
      console.log("Res ", tokenIdsRes);
      await switchChain.trigger();

      let requestPayload: any;
      const tokenIds = tokenIdsRes.token_ids.slice(0, arg.quantity);

      if (tokenIds.length === 0) {
        // Should never happen ideally, but could happen as currently backend is depending on frontend to sync info. Should be fixed once we integrate webhooks
        toast.error("You have no tokens to sell this time");
        return;
      }

      if (
        tokenIds.length === 1 &&
        user?.user?.data.profile.creator_token?.address === arg.contractAddress
      ) {
        toast.error("You need at least 1 of your Creator Token.");
        return;
      }

      if (tokenIds.length === 1) {
        const { request } = await publicClient.simulateContract({
          address: arg.contractAddress,
          account: wallet.address,
          abi: creatorTokenAbi,
          functionName: "sell",
          args: [tokenIds[0]],
          chain: baseChain,
        });
        requestPayload = request;
      } else {
        const { request } = await publicClient.simulateContract({
          address: arg.contractAddress,
          account: wallet.address,
          abi: creatorTokenAbi,
          functionName: "bulkSell",
          args: [tokenIds],
          chain: baseChain,
        });
        requestPayload = request;
      }

      const txHash = await wallet.walletClient?.writeContract?.(requestPayload);

      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txHash as any,
        pollingInterval: 2000,
      });

      if (transaction.status === "success") {
        mutate(getTotalCollectedKey(arg.contractAddress));
        mutate(
          getPriceToBuyNextKey({
            address: arg.contractAddress,
            tokenAmount: 1,
          })
        );
        await axios({
          url: "/v1/creator-token/poll-sell",
          method: "POST",
          data: {
            creator_token_id: arg.creatorTokenId,
            token_ids: tokenIds,
            tx_hash: txHash,
          },
        });
        return true;
      }
    },
    {
      onError: (error) => {
        Logger.error("useContractSellToken failed", error);
        Alert.alert("Failed", formatAPIErrorMessage(error));
      },
    }
  );

  return state;
};
