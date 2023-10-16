import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InformationCircle, Lock } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useUserProfile } from "app/hooks/api-hooks";
import { useContractTotalCollected } from "app/hooks/creator-token/use-contract-total-collected";
import { useContractPriceToBuyNext } from "app/hooks/creator-token/use-creator-token-price";
import { useWalletUSDCBalance } from "app/hooks/creator-token/use-wallet-usdc-balance";

type CreatorTokensPanelProps = { isSelf?: boolean; username?: string };
export const CreatorTokensPanel = ({
  isSelf,
  username,
}: CreatorTokensPanelProps) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const { data: userProfileData } = useUserProfile({ address: username });

  const totalCollectors = useContractTotalCollected({
    contractAddress: userProfileData?.data?.profile.creator_token?.address,
  });
  const priceToBuyNext = useContractPriceToBuyNext({
    address: userProfileData?.data?.profile.creator_token?.address,
    tokenAmount: 1,
  });
  const usdcBalance = useWalletUSDCBalance();

  if (isSelf) {
    return (
      <View tw="rounded-4xl mb-2 mt-4 border border-gray-200 px-10 py-4">
        <View tw="items-center gap-2">
          <View tw="w-full flex-row items-center justify-between">
            <View tw="flex-row items-center">
              <Text tw="mr-2 text-xs text-gray-500">Wallet balance</Text>
              <PressableScale
                tw="h-4 w-4"
                onPress={() => {
                  router.push(
                    Platform.select({
                      native: "/creator-token/explanation",
                      web: {
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          creatorTokensExplanationModal: true,
                        },
                      } as any,
                    }),
                    Platform.select({
                      native: "/creator-token/explanation",
                      web:
                        router.asPath === "/"
                          ? "/creator-token/explanation"
                          : router.asPath,
                    }),
                    { shallow: true }
                  );
                }}
                hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
              >
                <InformationCircle
                  width={16}
                  height={16}
                  color={colors.gray[500]}
                />
              </PressableScale>
            </View>
            <Text tw="text-base font-bold text-gray-900 dark:text-white">
              ${usdcBalance.data?.displayBalance}
            </Text>
          </View>
          <View tw="w-full flex-row items-center justify-between">
            <View tw="flex-row items-center">
              <Text tw="mr-2 text-xs text-gray-500">Token earnings </Text>
              <PressableScale
                tw="h-4 w-4"
                onPress={() => {
                  router.push(
                    Platform.select({
                      native: "/creator-token/explanation",
                      web: {
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          creatorTokensExplanationModal: true,
                        },
                      } as any,
                    }),
                    Platform.select({
                      native: "/creator-token/explanation",
                      web:
                        router.asPath === "/"
                          ? "/creator-token/explanation"
                          : router.asPath,
                    }),
                    { shallow: true }
                  );
                }}
                hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
              >
                <InformationCircle
                  width={16}
                  height={16}
                  color={colors.gray[500]}
                />
              </PressableScale>
            </View>
            <Text tw="text-base font-bold text-gray-900 dark:text-white">
              $21.67
            </Text>
          </View>
        </View>
      </View>
    );
  }
  const buyPath = `/creator-token/${username}/buy`;

  return (
    <View tw="rounded-4xl mb-2 mt-4 border border-gray-200 px-10 py-4">
      <View tw="flex-row items-center justify-between gap-4">
        <View tw="flex-1 items-center">
          <Text tw="text-xs text-gray-500">TOKEN</Text>
          <View tw="h-2" />
          {priceToBuyNext.isLoading ? (
            <Skeleton width={30} height={16} />
          ) : (
            <Text tw="text-base font-bold text-gray-900 dark:text-white">
              ${priceToBuyNext.data?.displayPrice}
            </Text>
          )}
          <Button
            tw="mt-2.5"
            style={{ backgroundColor: "#08F6CC", width: "100%" }}
            onPress={() => {
              router.push(
                Platform.select({
                  native: buyPath,
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      creatorTokenBuyModal: true,
                      username: username,
                    },
                  } as any,
                }),
                Platform.select({
                  native: buyPath,
                  web: router.asPath === "/" ? buyPath : router.asPath,
                }),
                { shallow: true }
              );
            }}
          >
            <>
              <Text tw="text-base font-bold text-gray-900">Buy</Text>
            </>
          </Button>
        </View>
        <View tw="flex-1 items-center justify-center">
          <Text tw="text-xs text-gray-500">COLLECTORS</Text>
          <View tw="h-2" />
          {totalCollectors.isLoading ? (
            <Skeleton width={30} height={16} />
          ) : (
            <Text tw="text-base font-bold text-gray-900 dark:text-white">
              {totalCollectors.data?.toString()}
            </Text>
          )}
          <Button
            tw="mt-2.5"
            style={{ backgroundColor: "#FD749D", width: "100%" }}
            onPress={() => {
              router.push(
                Platform.select({
                  native: buyPath,
                  web: {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      creatorTokenBuyModal: true,
                      username: username,
                    },
                  } as any,
                }),
                Platform.select({
                  native: buyPath,
                  web: router.asPath === "/" ? buyPath : router.asPath,
                }),
                { shallow: true }
              );
            }}
          >
            <>
              <Text tw="text-base font-bold text-gray-900">Sell</Text>
            </>
          </Button>
        </View>
        <PressableScale
          tw="absolute -right-7 top-1 h-4 w-4"
          onPress={() => {
            router.push(
              Platform.select({
                native: "/creator-token/explanation",
                web: {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    creatorTokensExplanationModal: true,
                  },
                } as any,
              }),
              Platform.select({
                native: "/creator-token/explanation",
                web:
                  router.asPath === "/"
                    ? "/creator-token/explanation"
                    : router.asPath,
              }),
              { shallow: true }
            );
          }}
          hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
        >
          <InformationCircle width={16} height={16} color={colors.gray[500]} />
        </PressableScale>
      </View>
      <View tw="mt-2 flex-row self-center">
        <Lock width={12} height={12} color={colors.gray[500]} />
        <Text
          style={{
            fontSize: 10,
          }}
          tw="ml-1 text-gray-500"
        >
          Collect at least 1 token to unlock their channel.
        </Text>
      </View>
    </View>
  );
};
