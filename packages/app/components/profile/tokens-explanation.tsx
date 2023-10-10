import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { GrowthArrow, PieChart, UnLocked } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const CreatorTokensExplanation = () => {
  const isDark = useIsDarkMode();
  return (
    <View tw=" flex-1 px-4 pb-2">
      <Text tw="text-xl font-semibold text-gray-900 dark:text-gray-50">
        What are Creator Tokens?
      </Text>
      <View tw="mt-7 flex-row items-center">
        <GrowthArrow color={isDark ? colors.gray[50] : colors.gray[900]} />
        <Text tw="ml-2 flex-1 text-sm text-gray-900 dark:text-gray-50">
          <Text tw="text-sm font-bold text-gray-900 dark:text-gray-50">
            Supporting early pays off.{" "}
          </Text>
          All Creator Tokens start at $1. Creator Token price increases with
          every purchase.
        </Text>
      </View>
      <View tw="mt-7 flex-row items-center">
        <UnLocked color={isDark ? colors.gray[50] : colors.gray[900]} />
        <Text tw="ml-2 flex-1 text-sm text-gray-900 dark:text-gray-50">
          <Text tw="text-sm font-bold text-gray-900 dark:text-gray-50">
            Collect to unlock a channel.{" "}
          </Text>
          A Creator Token unlocks full access to a Creator Channel where you can
          chat, upload exclusive audio, media & more.
        </Text>
      </View>
      <View tw="mt-7 flex-row items-center">
        <PieChart color={isDark ? colors.gray[50] : colors.gray[900]} />

        <Text tw="ml-2 flex-1 text-sm text-gray-900 dark:text-gray-50">
          <Text tw="text-sm font-bold text-gray-900 dark:text-gray-50">
            Earn every trade.{" "}
          </Text>
          Each trade, you earn a 7% fee and Showtime earns a 3% fee. This
          rewards you for engaging with their collectors.
        </Text>
      </View>
    </View>
  );
};
