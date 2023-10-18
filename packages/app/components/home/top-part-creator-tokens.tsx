import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { TopCreatorTokensItem } from "../creator-token/top-creator-tokens";

export const TopPartCreatorTokens = () => {
  const router = useRouter();

  return (
    <>
      <View tw="flex-row items-center justify-between py-6">
        <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
          Top Creator Tokens
        </Text>
        <Text
          onPress={() => {
            router.push("/creator-token/top");
          }}
          tw="text-xs font-semibold text-gray-500 dark:text-white"
        >
          See more
        </Text>
      </View>
      <View tw="flex-row flex-wrap items-center justify-between gap-4">
        {new Array(6).fill(0).map((_, i) => {
          return (
            <TopCreatorTokensItem index={i} key={i} style={{ width: "29%" }} />
          );
        })}
      </View>
    </>
  );
};
