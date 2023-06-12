import { useState, useRef, memo, useCallback, useMemo } from "react";
import {
  useWindowDimensions,
  Dimensions,
  Platform,
  ListRenderItemInfo,
} from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CreatorChannel as CreatorChannelIcon } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  useSuggestedChannelsList,
  CreatorChannel,
} from "app/components/creator-channels/hooks/use-channels-list";
import { DESKTOP_CONTENT_WIDTH } from "app/constants/layout";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { breakpoints } from "design-system/theme";

import { useJoinChannel } from "../creator-channels/hooks/use-join-channel";
import { HomeSlider } from "./home-slider";

const windowWidth = Dimensions.get("window").width;
const PopularCreatorItem = ({
  index,
  item,
  width,
}: {
  item: CreatorChannel;
  width: number;
  index: number;
}) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const joinChannel = useJoinChannel();
  const onJoinChannel = useCallback(async () => {
    await joinChannel.trigger({ channelId: item.id });
    router.push(`/channels/${item.id}?fresh=channel`);
  }, [item.id, joinChannel, router]);

  return (
    <View
      tw="h-[230px] w-full"
      style={{
        width: Platform.select({
          web: undefined,
          default: width,
        }),
      }}
    >
      <View tw="h-[84px] w-[84px]">
        <Avatar url={item?.owner?.img_url} size={84} />
        <View tw="absolute -bottom-1 -right-4 self-center rounded-full bg-white p-2 dark:bg-black dark:shadow-white/20">
          <CreatorChannelIcon
            color={isDark ? colors.white : colors.black}
            width={24}
            height={24}
          />
        </View>
      </View>
      <View tw="mt-3">
        <Text tw="text-base font-semibold text-black dark:text-white">
          {item?.owner?.name || item?.owner?.username}
        </Text>
        <View tw="h-2" />
        <Text
          tw="font-bold text-gray-500 dark:text-gray-400"
          style={{ fontSize: 10, lineHeight: 12 }}
        >
          {`${item?.member_count} members`}
        </Text>
        <View tw="h-2.5" />
        <Text tw="text-sm text-gray-600 dark:text-gray-300" numberOfLines={4}>
          {item?.owner?.bio}
        </Text>
      </View>
      <PressableScale
        tw={[
          "absolute bottom-0 h-5 items-center justify-center rounded-full border border-gray-300 px-3.5 dark:border-gray-600",
        ]}
        onPress={onJoinChannel}
      >
        <Text tw="text-xs font-bold text-gray-900 dark:text-white">Join</Text>
      </PressableScale>
    </View>
  );
};
export const PopularCreators = memo(function PopularCreators() {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { data, mutate, isLoading } = useSuggestedChannelsList();
  const router = useRouter();
  const pagerWidth = isMdWidth ? DESKTOP_CONTENT_WIDTH : windowWidth - 32;
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<CreatorChannel>) => (
      <PopularCreatorItem
        item={item}
        index={index}
        width={Platform.select({ web: undefined, default: pagerWidth / 2 })}
      />
    ),
    [pagerWidth]
  );
  if (data.length === 0) return null;
  return (
    <View tw="w-full pl-4 md:pl-0">
      <View tw="w-full flex-row items-center justify-between py-4 pr-4">
        <Text tw="text-sm font-bold text-gray-900 dark:text-white">
          Popular artists
        </Text>
        <Text
          tw="text-sm font-semibold text-indigo-700"
          onPress={() => {
            router.push("/channels");
          }}
        >
          see all
        </Text>
      </View>
      <View tw="mb-8 w-full rounded-2xl">
        <HomeSlider data={data} renderItem={renderItem} />
      </View>
    </View>
  );
});
