import { useState } from "react";

import { createParam } from "solito";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { InformationCircle, LockBadge } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useUserProfile } from "app/hooks/api-hooks";
import { useContractBalanceOfToken } from "app/hooks/creator-token/use-balance-of-token";
import { useApproveToken } from "app/hooks/creator-token/use-creator-token-approve";
import { useContractBuyToken } from "app/hooks/creator-token/use-creator-token-buy";
import { useCreatorTokenBuyPoll } from "app/hooks/creator-token/use-creator-token-buy-poll";
import { useContractPriceToBuyNext } from "app/hooks/creator-token/use-creator-token-price";
import { useWallet } from "app/hooks/use-wallet";

type Query = {
  username: string;
};

const { useParam } = createParam<Query>();

export const BuyCreatorToken = () => {
  const wallet = useWallet();
  const [username] = useParam("username");
  const approveToken = useApproveToken();
  const buyToken = useContractBuyToken();
  const [tokenAmount, setTokenAmount] = useState(1);
  const { data: profileData } = useUserProfile({ address: username });
  const Alert = useAlert();
  const pollBuyToken = useCreatorTokenBuyPoll();
  const priceToBuyNext = useContractPriceToBuyNext({
    address: profileData?.data?.profile.creator_token?.address,
    tokenAmount,
  });
  const router = useRouter();

  const tokenBalance = useContractBalanceOfToken({
    ownerAddress: wallet.address,
    contractAddress: profileData?.data?.profile.creator_token?.address,
  });

  const renderBuyButton = () => {
    if (wallet.isMagicWallet) {
      return (
        <Button
          onPress={() => {
            wallet.connect();
          }}
        >
          Connect
        </Button>
      );
    } else {
      return (
        <Button
          onPress={async () => {
            if (wallet.address && profileData?.data?.profile.creator_token) {
              // @ts-ignore
              const result = await approveToken.trigger({
                creatorTokenContract:
                  profileData?.data?.profile.creator_token.address,
                maxPrice: priceToBuyNext.data?.totalPrice,
              });
              if (result) {
                const res = await buyToken.trigger({
                  contractAddress:
                    profileData?.data?.profile.creator_token.address,
                  maxPrice: priceToBuyNext.data?.totalPrice,
                });

                if (res) {
                  pollBuyToken.pollBuyStatus({
                    creatorTokenId: profileData.data.profile.creator_token.id,
                    txHash: res,
                    quantity: tokenAmount,
                  });
                  Alert.alert("Success", "You have bought the token");
                  router.pop();
                }
              } else {
                Alert.alert("Failed", "Approve transaction failed");
              }
            }
          }}
        >
          {pollBuyToken.status === "pending" || approveToken.isMutating
            ? "Loading..."
            : "Approve & Buy"}
        </Button>
      );
    }
  };

  return (
    <View tw="p-4">
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <View tw="flex-row items-center" style={{ columnGap: 2 }}>
          <Text tw="text-2xl font-semibold">Buy @{username}</Text>
          <VerificationBadge size={20} />
        </View>
        <Text tw="text-2xl font-semibold">tokens</Text>
      </View>
      <View tw="flex-row items-center pt-4" style={{ columnGap: 2 }}>
        <LockBadge width={14} height={14} color={colors.gray[600]} />
        <Text tw="text-gray-600">Unlocks exclusive channel content</Text>
      </View>
      <View tw="mt-4 rounded-3xl border-[1px] border-gray-300 p-8">
        <View tw="flex-row" style={{ columnGap: 16 }}>
          <Avatar size={100} url={profileData?.data?.profile.img_url} />
          <View style={{ rowGap: 16 }}>
            <View tw="flex-row" style={{ columnGap: 8 }}>
              <View tw="items-start self-start rounded-md bg-black p-2">
                <Text tw="text-xs text-white">USDC</Text>
              </View>
              {/* <View tw="items-start self-start rounded-sm bg-blue-200 px-2">
                <Text>ETH</Text>
              </View> */}
            </View>
            <View>
              {priceToBuyNext.isValidating ? (
                <Skeleton width={100} height={32} />
              ) : (
                <Text tw="text-4xl font-semibold">
                  ${priceToBuyNext.data?.displayPrice}
                </Text>
              )}
            </View>
            {/* <View>
              <Text tw="font-semibold text-green-500">^ $2.49 (25%) Month</Text>
            </View> */}
          </View>
        </View>
        <View
          tw="mt-4 flex-row items-center justify-between"
          style={{ columnGap: 16 }}
        >
          <Button tw="flex-1" style={{ backgroundColor: "#08F6CC" }}>
            <Text style={{ color: colors.black }} tw="font-semibold">
              Buy
            </Text>
          </Button>
          <Button tw="flex-1" style={{ backgroundColor: colors.gray[200] }}>
            <Text style={{ color: colors.black }} tw="font-semibold">
              Sell
            </Text>
          </Button>
          <View>
            <InformationCircle color={colors.gray[400]} />
          </View>
        </View>
      </View>
      <View style={{ rowGap: 16 }} tw="mt-8">
        <View tw="flex-row justify-between">
          <Text tw="text-gray-700">You own:</Text>
          {tokenBalance.isLoading ? (
            <Skeleton width={40} height={14} />
          ) : (
            <Text tw="text-gray-700">{tokenBalance.data?.toString()}</Text>
          )}
        </View>
        <View tw="flex-row items-center">
          <Text tw="flex-2 text-gray-700">Quantity to buy:</Text>
          <View tw="w-4" />
          <View tw="flex-1 flex-row rounded-sm border-[1px] border-gray-200">
            <View tw="flex-1 border-gray-200 p-4 text-center">
              <Text>{tokenAmount}</Text>
            </View>
            <Pressable
              onPress={() => {
                setTokenAmount((t) => (t > 1 ? t - 1 : 1));
              }}
              tw="flex-1 items-center border-[1px] border-transparent border-l-gray-200 border-r-gray-200 bg-blue-50 p-4"
            >
              <Text tw="text-2xl font-normal">-</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTokenAmount((t) => t + 1);
              }}
              tw="flex-1 items-center bg-blue-50 p-4"
            >
              <Text tw="text-2xl font-normal">+</Text>
            </Pressable>
          </View>
        </View>
        {/* <View tw="flex-row justify-between">
          <Text tw="text-gray-700">Estimated transaction fee:</Text>
          <Text tw="text-gray-700">$4.00</Text>
        </View> */}
        <View tw="flex-row justify-between">
          <Text tw="text-gray-700">You will pay in USDC:</Text>
          {priceToBuyNext.isValidating ? (
            <Skeleton width={40} height={14} />
          ) : (
            <Text tw="text-gray-700">${priceToBuyNext.data?.displayPrice}</Text>
          )}
        </View>
      </View>
      <View tw="h-8" />
      {renderBuyButton()}
    </View>
  );
};
