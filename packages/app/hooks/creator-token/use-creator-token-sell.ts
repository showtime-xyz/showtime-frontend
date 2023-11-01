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
import { getContractBalanceOfTokenKey } from "./use-balance-of-token";
import { getTotalCollectedKey } from "./use-contract-total-collected";
import { getPriceToBuyNextKey } from "./use-creator-token-price-to-buy-next";
import { useSwitchChain } from "./use-switch-chain";
import { baseChain } from "./utils";

type TokenIdsMappingResponseType = {
  logged_in_wallet_address: string;
  token_ids_by_wallet: {
    [key: string]: string[];
  };
};

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

      const walletAddress = (
        await wallet.getWalletClient?.()?.getAddresses?.()
      )?.[0];

      const tokenIdsRes: TokenIdsMappingResponseType = await axios({
        url:
          "/v1/creator-token/sell/token-ids/profile?creator_token_id=" +
          arg.creatorTokenId,
        method: "GET",
      });
      console.log("token ids ", tokenIdsRes);
      if (tokenIdsRes && walletAddress) {
        const walletsThatOwnToken = Object.keys(
          tokenIdsRes.token_ids_by_wallet
        );

        if (walletsThatOwnToken.length === 0) {
          toast.error("You don't own any of this token.");
          return;
        }

        const walletAddressKey = walletsThatOwnToken.find(
          (c) => c.toLowerCase() === walletAddress.toLowerCase()
        );

        if (walletAddressKey) {
          const tokenIds = tokenIdsRes.token_ids_by_wallet[
            walletAddressKey
          ].slice(0, arg.quantity);

          if (
            tokenIds.length === 1 &&
            user?.user?.data.profile.creator_token?.address ===
              arg.contractAddress
          ) {
            toast.error("You need at least 1 of your Creator Token.");
            return;
          }

          await switchChain.trigger();
          let requestPayload: any;

          if (tokenIds.length === 1) {
            const { request } = await publicClient.simulateContract({
              address: arg.contractAddress,
              account: walletAddress,
              abi: creatorTokenAbi,
              functionName: "sell",
              args: [Number(tokenIds[0])],
              chain: baseChain,
            });
            requestPayload = request;
          } else {
            const { request } = await publicClient.simulateContract({
              address: arg.contractAddress,
              account: walletAddress,
              abi: creatorTokenAbi,
              functionName: "bulkSell",
              args: [tokenIds.map((c) => Number(c))],
              chain: baseChain,
            });
            requestPayload = request;
          }

          const txHash = await wallet.walletClient?.writeContract?.(
            requestPayload
          );

          const transaction = await publicClient.waitForTransactionReceipt({
            hash: txHash as any,
            pollingInterval: 2000,
            confirmations: 2,
          });

          if (transaction.status === "success") {
            mutate(getTotalCollectedKey(arg.contractAddress));
            mutate(
              getPriceToBuyNextKey({
                address: arg.contractAddress,
                tokenAmount: 1,
              })
            );
            mutate(
              getContractBalanceOfTokenKey({
                ownerAddress: walletAddress,
                contractAddress: arg.contractAddress,
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
        } else if (tokenIdsRes.token_ids_by_wallet) {
          Alert.alert(
            "Failed",
            `Your current wallet doesn't own all the tokens you are trying to sell. Try selling using one of the wallets you used to buy the tokens. e.g. ${Object.keys(
              tokenIdsRes.token_ids_by_wallet
            ).join(", ")}`
          );
        }
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
