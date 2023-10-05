import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const TopPartCreatorTokens = () => {
  const isDark = useIsDarkMode();
  const router = useRouter();

  return (
    <View tw="px-4">
      <View tw="flex-row items-center justify-between py-6">
        <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
          Top Creator Tokens
        </Text>
        <Text
          onPress={() => {
            router.push("/topCreatorTokens");
          }}
          tw="text-xs font-semibold text-gray-500"
        >
          See more
        </Text>
      </View>
      <View tw="flex-row gap-2.5">
        {new Array(3).fill(0).map((_, i) => {
          return (
            <View
              key={i}
              tw="flex-1 items-center overflow-hidden rounded-md border border-gray-300 px-1 py-4 dark:border-gray-600"
            >
              <View tw="mb-2">
                <View tw="absolute -left-1 top-0">
                  <Showtime
                    width={8}
                    height={8}
                    color={isDark ? colors.white : colors.gray[900]}
                  />
                </View>
                <Text tw="absolute -left-3 top-5 text-xs font-semibold text-gray-500">
                  {i + 1}
                </Text>

                <Avatar
                  url={
                    "https://media-stage.showtime.xyz/c95130b6-3cdb-4056-9cda-4258675d435d.jpeg"
                  }
                  size={44}
                />
              </View>
              <Text tw="text-sm font-semibold text-gray-900 dark:text-white">
                @alan
              </Text>
              <View tw="h-2" />
              <Text tw="text-sm font-bold text-gray-900 dark:text-white">
                $2.60
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
