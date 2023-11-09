import { useMemo } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  useCreatorTokenCollectors,
  useTopCreatorToken,
} from "app/hooks/creator-token/use-creator-tokens";

import {
  TopCreatorTokenItem,
  TopCreatorTokenSkeleton,
} from "../creator-token/creator-token-users";

export const TopPartCreatorTokens = () => {
  const router = useRouter();
  const { data, isLoading } = useTopCreatorToken(6);

  return (
    <View tw="px-4 md:pl-2 md:pr-4 lg:px-0">
      <View tw="flex-row items-center justify-between py-4">
        <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
          Leaderboard
        </Text>
        <Text
          onPress={() => {
            router.push("/");
          }}
          tw="text-xs font-semibold text-indigo-700"
        >
          See all
        </Text>
      </View>
      {isLoading ? (
        <View>
          {data?.map((_, i) => {
            return <TopCreatorTokenSkeleton key={i} />;
          })}
        </View>
      ) : (
        <View tw="flex-row flex-wrap">
          <View tw="flex-1">
            {data?.map((item, i) => {
              return (
                <TopCreatorTokenItem
                  item={item}
                  index={i}
                  key={i}
                  tw="pr-0.5"
                />
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};
