import { useState, useEffect } from "react";
import { Linking } from "react-native";

import { createParam } from "solito";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InformationCircle, LockBadge } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useUserProfile } from "app/hooks/api-hooks";
import { useContractBalanceOfToken } from "app/hooks/creator-token/use-balance-of-token";
import { useCreatorTokenBuy } from "app/hooks/creator-token/use-creator-token-buy";
import { useCreatorTokenPriceToBuyNext } from "app/hooks/creator-token/use-creator-token-price-to-buy-next";
import { useCreatorTokenPriceToSellNext } from "app/hooks/creator-token/use-creator-token-price-to-sell-next";
import { useCreatorTokenSell } from "app/hooks/creator-token/use-creator-token-sell";
import { useWalletUSDCBalance } from "app/hooks/creator-token/use-wallet-usdc-balance";
import { useRedirectToCreatorTokensShare } from "app/hooks/use-redirect-to-creator-tokens-share-screen";
import { useWallet } from "app/hooks/use-wallet";

import { toast } from "design-system/toast";

import { CreatorTokensExplanation } from "../profile/tokens-explanation";

type Query = {
  username: string;
  selectedAction: "buy" | "sell";
};

const { useParam } = createParam<Query>();
// const paymentMethods = ["USDC", "ETH"];
const paymentMethods = ["USDC"];
export const BuyCreatorToken = () => {
  const wallet = useWallet();
  const [username] = useParam("username");
  const [selectedActionParam] = useParam("selectedAction");
  const [tokenAmount, setTokenAmount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("USDC");

  const { data: profileData } = useUserProfile({ address: username });
  const buyToken = useCreatorTokenBuy({ username, tokenAmount });
  const sellToken = useCreatorTokenSell();
  const redirectToCreatorTokensShare = useRedirectToCreatorTokensShare();
  const [selectedAction, setSelectedAction] = useState<"buy" | "sell">(
    selectedActionParam ?? "buy"
  );
  const usdcBalance = useWalletUSDCBalance();
  const [showExplanation, setShowExplanation] = useState(false);
  const priceToBuyNext = useCreatorTokenPriceToBuyNext(
    selectedAction === "buy"
      ? {
          address: profileData?.data?.profile.creator_token?.address,
          tokenAmount,
        }
      : undefined
  );
  const priceToSellNext = useCreatorTokenPriceToSellNext(
    selectedAction === "sell"
      ? {
          address: profileData?.data?.profile.creator_token?.address,
          tokenAmount,
        }
      : undefined
  );
  const router = useRouter();

  const tokenBalance = useContractBalanceOfToken({
    ownerAddress: wallet.address,
    contractAddress: profileData?.data?.profile.creator_token?.address,
  });

  const renderBuyButton = () => {
    if (usdcBalance.data?.balance === 0n && !wallet.isMagicWallet) {
      return (
        <Button
          onPress={() =>
            Linking.openURL(
              "https://app.uniswap.org/swap?outputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&chain=base"
            )
          }
        >
          Buy USDC on Uniswap
        </Button>
      );
    }

    if (selectedAction === "sell") {
      return (
        <Button
          disabled={sellToken.isMutating}
          onPress={async () => {
            const tokenSellPrice = priceToSellNext.data?.displayPrice;
            if (profileData?.data?.profile.creator_token) {
              const res = await sellToken.trigger({
                contractAddress:
                  profileData?.data?.profile.creator_token?.address,
                creatorTokenId: profileData?.data?.profile.creator_token?.id,
                quantity: tokenAmount,
              });
              if (res) {
                router.pop();
                toast.success("Sold for " + tokenSellPrice + " USDC");
              }
            }
          }}
        >
          {sellToken.isMutating
            ? "Please wait..."
            : wallet.isMagicWallet
            ? "Connect"
            : "Sell"}
        </Button>
      );
    } else {
      return (
        <Button
          disabled={buyToken.isMutating}
          onPress={async () => {
            if (profileData?.data?.profile) {
              const res = await buyToken.trigger();
              if (res) {
                redirectToCreatorTokensShare({
                  username: profileData.data.profile.username,
                  type: "collected",
                  collectedCount: tokenAmount,
                });
                router.pop();
              }
            }
          }}
        >
          {buyToken.isMutating
            ? "Please wait..."
            : wallet.isMagicWallet
            ? "Connect"
            : "Approve & Buy"}
        </Button>
      );
    }
  };

  useEffect(() => {
    if (selectedAction === "sell" && typeof tokenBalance.data !== "undefined") {
      setTokenAmount(Math.min(1, Number(tokenBalance.data)));
    } else {
      setTokenAmount(1);
    }
  }, [selectedAction, tokenBalance.data]);
  const isDark = useIsDarkMode();

  return (
    <BottomSheetModalProvider>
      <>
        <View tw="px-4 py-2">
          <View tw="flex-row items-center" style={{ columnGap: 8 }}>
            <View tw="flex-row items-center" style={{ columnGap: 2 }}>
              <Text tw="text-xl font-semibold dark:text-gray-200">
                {selectedAction === "buy" ? "Buy" : "Sell"} @{username}
              </Text>
              <VerificationBadge size={20} />
            </View>
            <Text tw="text-xl font-semibold dark:text-gray-200">tokens</Text>
          </View>
          {selectedAction === "buy" ? (
            <View tw="h-6 flex-row items-center pt-2" style={{ columnGap: 2 }}>
              <LockBadge
                width={14}
                height={14}
                color={isDark ? colors.gray[300] : colors.gray[600]}
              />
              <Text tw="text-gray-600 dark:text-gray-300">
                Unlocks exclusive channel content
              </Text>
            </View>
          ) : (
            <View tw="h-6" />
          )}
          <View tw="mt-6 rounded-3xl border-[1px] border-gray-300 p-8 dark:border-gray-800">
            <View tw="flex-row" style={{ columnGap: 16 }}>
              <Avatar size={100} url={profileData?.data?.profile.img_url} />
              <View style={{ rowGap: 16 }}>
                <View tw="mr-auto flex-row overflow-hidden rounded-md">
                  {paymentMethods.map((method) => (
                    <Pressable
                      key={method}
                      tw={[
                        "items-start self-start  p-2",
                        paymentMethod === method
                          ? "bg-gray-900 dark:bg-gray-200"
                          : "bg-gray-200 dark:bg-gray-700",
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Text
                        tw={[
                          "text-xs",
                          paymentMethod === method
                            ? "text-white dark:text-gray-900"
                            : "text-gray-900 dark:text-white",
                        ]}
                      >
                        {method}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View tw="flex-row items-center" style={{ columnGap: 4 }}>
                  <Image
                    source={require("./usdc-image.png")}
                    width={24}
                    height={24}
                  />
                  {selectedAction === "buy" ? (
                    <View>
                      {priceToBuyNext.isLoading ? (
                        <Skeleton width={100} height={27} />
                      ) : (
                        <Text tw="text-4xl font-semibold text-gray-800 dark:text-gray-200">
                          {priceToBuyNext.data?.displayPrice}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View>
                      {priceToSellNext.isLoading ? (
                        <Skeleton width={100} height={27} />
                      ) : (
                        <Text tw="text-4xl font-semibold dark:text-gray-200">
                          {priceToSellNext.data?.displayPrice}
                        </Text>
                      )}
                    </View>
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
              <Button
                tw="flex-1"
                style={{
                  backgroundColor:
                    selectedAction === "buy" ? "#08F6CC" : colors.gray[200],
                  opacity: selectedAction === "buy" ? 1 : 0.7,
                  height: 28,
                }}
                onPress={() => setSelectedAction("buy")}
              >
                <Text style={{ color: colors.black }} tw="font-semibold">
                  Buy
                </Text>
              </Button>
              <Button
                tw="flex-1"
                style={{
                  backgroundColor:
                    selectedAction === "sell"
                      ? colors.red[400]
                      : colors.gray[200],
                  height: 28,
                  opacity: selectedAction === "sell" ? 1 : 0.7,
                }}
                onPress={() => setSelectedAction("sell")}
              >
                <Text style={{ color: colors.black }} tw="font-semibold">
                  Sell
                </Text>
              </Button>
              <Pressable
                onPress={() => {
                  setShowExplanation(true);
                }}
              >
                <InformationCircle
                  width={20}
                  height={20}
                  color={isDark ? colors.gray[200] : colors.gray[400]}
                />
              </Pressable>
            </View>
          </View>
          <View style={{ rowGap: 16 }} tw="mt-8">
            <View tw="flex-row justify-between">
              <Text tw="text-gray-700 dark:text-gray-200">You own:</Text>
              {tokenBalance.isLoading ? (
                <Skeleton width={40} height={16} />
              ) : (
                <Text tw="font-semibold text-gray-700 dark:text-gray-200">
                  {tokenBalance.data?.toString() ?? "N/A"}
                </Text>
              )}
            </View>
            <View tw="flex-row items-center">
              <Text tw="flex-2 w-32 text-gray-700 dark:text-gray-200">
                Quantity to {selectedAction === "buy" ? "buy" : "sell"}:
              </Text>
              <View tw="w-4" />
              <View tw="flex-1 flex-row overflow-hidden rounded-xl border-[1px] border-gray-200 dark:border-gray-700">
                <View tw="flex-1 border-gray-200 p-4 text-center dark:border-gray-700 dark:text-gray-200">
                  <Text
                    tw="text-xl font-semibold text-gray-900 dark:text-gray-200"
                    style={{ lineHeight: 24 }}
                  >
                    {tokenAmount}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setTokenAmount((t) => (t > 1 ? t - 1 : 1));
                  }}
                  tw="-mt-0.5 flex-1 items-center border-[1px] border-transparent border-l-gray-200 border-r-gray-200 bg-blue-50 p-4 dark:border-l-gray-600 dark:border-r-gray-600 dark:bg-gray-800"
                >
                  <Text tw="select-none text-2xl font-normal text-gray-800 dark:text-gray-200">
                    —
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setTokenAmount((t) =>
                      selectedAction === "sell" &&
                      tokenBalance.data &&
                      t >= Number(tokenBalance.data)
                        ? t
                        : t + 1
                    );
                  }}
                  tw="-mt-1 flex-1 items-center justify-center bg-blue-50 p-4 dark:bg-gray-800"
                >
                  <Text tw="select-none text-3xl font-normal text-gray-800 dark:text-gray-200">
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
            {/* <View tw="flex-row justify-between">
          <Text tw="text-gray-700">Estimated transaction fee:</Text>
          <Text tw="text-gray-700">$4.00</Text>
        </View> */}
            <View tw="flex-row justify-between">
              <Text tw="text-gray-700 dark:text-gray-200">
                {selectedAction === "buy"
                  ? "You will pay in USDC:"
                  : "You will receive in USDC:"}
              </Text>
              {selectedAction === "buy" ? (
                <>
                  {priceToBuyNext.isLoading ? (
                    <Skeleton width={60} height={16} />
                  ) : (
                    <Text tw="font-semibold text-gray-700 dark:text-gray-200">
                      ${priceToBuyNext.data?.displayPrice}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  {priceToSellNext.isLoading ? (
                    <Skeleton width={60} height={16} />
                  ) : (
                    <Text tw="font-semibold text-gray-700 dark:text-gray-200">
                      ${priceToSellNext.data?.displayPrice}
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>
          <View tw="h-8" />
          {renderBuyButton()}
          <View tw="items-center pt-4">
            <Text tw="text-center text-xs text-gray-500 dark:text-gray-400">
              {paymentMethod === "USDC"
                ? "USDC is traded on the Base network."
                : "Must purchase with Crypto on Base network"}
            </Text>
          </View>
        </View>
        <ModalSheet
          snapPoints={[400]}
          title=""
          visible={showExplanation}
          close={() => setShowExplanation(false)}
          onClose={() => setShowExplanation(false)}
          tw="sm:w-[400px] md:w-[400px] lg:w-[400px] xl:w-[400px] "
        >
          <CreatorTokensExplanation />
        </ModalSheet>
      </>
    </BottomSheetModalProvider>
  );
};
