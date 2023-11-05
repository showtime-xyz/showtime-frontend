import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorTokenCollectors } from "app/hooks/creator-token/use-creator-tokens";

import { TopCreatorTokensItem } from "../creator-token/creator-token-users";

export const TopPartCreatorTokens = () => {
  const router = useRouter();
  const { data, isLoading } = useCreatorTokenCollectors(27);
  if ((!data?.length || data?.length === 0) && !isLoading) {
    return null;
  }
  return (
    <View tw="px-4 md:pl-2 md:pr-4 lg:px-0">
      <View tw="flex-row items-center justify-between py-6">
        <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
          Top Creator Tokens
        </Text>
        <Text
          onPress={() => {
            router.push("/creator-token/top");
          }}
          tw="text-xs font-semibold text-gray-500"
        >
          See more
        </Text>
      </View>
      <View tw="flex-row flex-wrap items-center justify-between gap-2 lg:gap-4">
        {data?.map((item, i) => {
          return (
            <TopCreatorTokensItem
              item={item}
              index={i}
              key={i}
              style={{ width: "29%" }}
            />
          );
        })}
      </View>
    </View>
  );
};
