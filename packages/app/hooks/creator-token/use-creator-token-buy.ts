import useSWRMutation from "swr/mutation";

import { useAlert } from "@showtime-xyz/universal.alert";

import { Logger } from "app/lib/logger";
import { formatAPIErrorMessage } from "app/utilities";

import { useUserProfile } from "../api-hooks";
import { useAuth } from "../auth/use-auth";
import { useWallet } from "../use-wallet";
import { useApproveToken } from "./use-creator-token-approve";
import { useCreatorTokenBuyPoll } from "./use-creator-token-buy-poll";
import { useCreatorTokenContractBuy } from "./use-creator-token-contract-buy";
import { useContractPriceToBuyNext } from "./use-creator-token-price";
import { useSwitchChain } from "./use-switch-chain";

export const useCreatorTokenBuy = (params: {
  username?: string;
  tokenAmount: number;
}) => {
  const { username, tokenAmount } = params;
  const { data: profileData } = useUserProfile({ address: username });
  const wallet = useWallet();
  const approveToken = useApproveToken();
  const priceToBuyNext = useContractPriceToBuyNext({
    address: profileData?.data?.profile.creator_token?.address,
    tokenAmount,
  });
  const buyToken = useCreatorTokenContractBuy();
  const Alert = useAlert();
  const pollBuyToken = useCreatorTokenBuyPoll();
  const { logout } = useAuth();
  const switchChain = useSwitchChain();

  const state = useSWRMutation(
    "buyCreatorToken",
    async () => {
      if (wallet.isMagicWallet) {
        Alert.alert(
          "Unsupported wallet",
          "Please login using a web3 wallet to buy the creator token",
          [
            {
              text: "Log out",
              onPress: () => {
                logout();
              },
            },
          ]
        );
      } else {
        if (wallet.address && profileData?.data?.profile.creator_token) {
          await switchChain.trigger();
          // @ts-ignore
          const result = await approveToken.trigger({
            creatorTokenContract:
              profileData?.data?.profile.creator_token.address,
            maxPrice: priceToBuyNext.data?.totalPrice,
          });
          if (result) {
            const res = await buyToken.trigger({
              contractAddress: profileData?.data?.profile.creator_token.address,
              maxPrice: priceToBuyNext.data?.totalPrice,
              quantity: tokenAmount,
            });

            if (res) {
              await pollBuyToken.pollBuyStatus({
                creatorTokenId: profileData.data.profile.creator_token.id,
                txHash: res,
                quantity: tokenAmount,
              });
              return true;
            }
          } else {
            Alert.alert("Failed", "Approve transaction failed");
          }
        }
      }
    },
    {
      onError: (error) => {
        {
          Logger.error("useCreatorTokenContractBuy", error);
          Alert.alert("Failed", formatAPIErrorMessage(error));
        }
      },
    }
  );

  return state;
};
