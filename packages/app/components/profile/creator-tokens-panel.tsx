import { useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InformationCircle, Lock } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type CreatorTokensPanelProps = { isSelf?: boolean };
export const CreatorTokensPanel = ({ isSelf }: CreatorTokensPanelProps) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
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
              $21.67
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
  return (
    <View tw="rounded-4xl mb-2 mt-4 border border-gray-200 px-10 py-4">
      <View tw="flex-row items-center justify-between gap-4">
        <View tw="flex-1 items-center">
          <Text tw="text-xs text-gray-500">TOKEN</Text>
          <View tw="h-2" />
          <Text tw="text-base font-bold text-gray-900 dark:text-white">
            $21.67
          </Text>
          <Button
            tw="mt-2.5"
            style={{ backgroundColor: "#08F6CC", width: "100%" }}
          >
            <>
              <Text tw="text-base font-bold text-gray-900">Buy</Text>
            </>
          </Button>
        </View>
        <View tw="flex-1 items-center justify-center">
          <Text tw="text-xs text-gray-500">COLLECTORS</Text>
          <View tw="h-2" />
          <Text tw="text-base font-bold text-gray-900 dark:text-white">
            128
          </Text>
          <Button
            tw="mt-2.5"
            style={{ backgroundColor: "#FD749D", width: "100%" }}
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
