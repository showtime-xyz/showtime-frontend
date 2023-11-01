import { Platform } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime } from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { CreatorTokenUser } from "app/hooks/creator-token/use-creator-tokens";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

export const CreatorTokensTitle = ({ title }: { title: string }) => {
  const headerHeight = useHeaderHeight();
  return (
    <View tw="mb-4">
      <View
        style={{
          height: Platform.select({
            ios: headerHeight + 8,
            default: 8,
          }),
        }}
      />
      <View tw="hidden flex-row justify-between bg-white pb-4 dark:bg-black md:flex">
        <Text tw="font-bold text-gray-900 dark:text-white md:text-xl">
          {title}
        </Text>
      </View>
    </View>
  );
};
export const TopCreatorTokensItem = ({
  index,
  tw,
  item,
  ...rest
}: ViewProps & { index: number; item: CreatorTokenUser }) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  return (
    <PressableHover
      tw={[
        "mb-3 items-center rounded-md border border-gray-200 bg-slate-50 px-1 py-4 dark:border-gray-700 dark:bg-gray-900",
        tw,
      ].join(" ")}
      onPress={() => router.push(`/@${item.username}`)}
      {...rest}
    >
      <>
        <View tw="mb-3">
          <View tw="absolute -left-1 top-0">
            <Showtime
              width={8}
              height={8}
              color={isDark ? colors.white : colors.gray[900]}
            />
          </View>
          <Avatar url={item?.img_url} size={44} />
        </View>
        <Text
          tw="px-1 text-sm font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          @{item?.username}
        </Text>
        {/* <View tw="h-3" />
        <Text tw="text-sm font-bold text-gray-900 dark:text-white">$2.60</Text> */}
      </>
      {/* <View tw="absolute -right-2.5 -top-2.5 h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-500 px-1.5 text-gray-500 dark:bg-gray-600">
        <Text tw="text-xs font-semibold text-white">{index + 1}</Text>
      </View> */}
    </PressableHover>
  );
};
