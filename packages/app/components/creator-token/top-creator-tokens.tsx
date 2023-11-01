import { useCallback } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Showtime } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import {
  CreatorTokenUser,
  useCreatorTokenCollectors,
} from "app/hooks/creator-token/use-creator-tokens";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { breakpoints } from "design-system/theme";

const Header = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      <View
        style={{
          height: Platform.select({
            ios: headerHeight + 8,
            default: 8,
          }),
        }}
      />
      <View tw="hidden flex-row justify-between bg-white pb-4 pt-6 dark:bg-black md:flex">
        <Text tw="font-bold text-gray-900 dark:text-white md:text-xl">
          Top Creator Tokens
        </Text>
      </View>
    </>
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
        <View tw="h-3" />
        {/* <Text tw="text-sm font-bold text-gray-900 dark:text-white">$2.60</Text> */}
      </>
      <View tw="absolute -right-2.5 -top-2.5 h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-500 px-1.5 text-gray-500 dark:bg-gray-600">
        <Text tw="text-xs font-semibold text-white">{index + 1}</Text>
      </View>
    </PressableHover>
  );
};
const keyExtractor = (item: CreatorTokenUser) => `${item.profile_id}`;
export const TopCreatorTokens = () => {
  const { height: screenHeight, width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { data: list, isLoading } = useCreatorTokenCollectors(27);

  const numColumns = 3;

  const renderItem = useCallback(
    ({
      item,
      index,
    }: ListRenderItemInfo<CreatorTokenUser & { loading?: boolean }>) => {
      return <TopCreatorTokensItem item={item} index={index} />;
    },
    []
  );

  const getItemType = useCallback(
    (_: CreatorTokenUser, index: number) => {
      const marginLeft = isMdWidth ? 0 : index % numColumns === 0 ? 0 : 8;
      if (marginLeft) {
        return "right";
      }
      return "left";
    },
    [isMdWidth, numColumns]
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View tw="mx-auto w-full max-w-screen-xl justify-center md:px-0">
          <Spinner />
        </View>
      );
    }
    return (
      <EmptyPlaceholder
        title={"No creator tokens, yet."}
        tw="h-[50vh]"
        hideLoginBtn
      />
    );
  }, [isLoading]);

  return (
    <View tw="min-h-screen w-full bg-white dark:bg-black">
      <View tw="md:max-w-screen-content mx-auto w-full">
        <ErrorBoundary>
          <InfiniteScrollList
            useWindowScroll
            data={list?.profiles || []}
            preserveScrollPosition
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            renderItem={renderItem}
            drawDistance={500}
            getItemType={getItemType}
            style={{
              height: Platform.select({
                web: undefined,
                default: screenHeight,
              }),
            }}
            contentContainerStyle={{
              paddingHorizontal: 8,
            }}
            overscan={12}
            containerTw="px-4 md:px-0"
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={Header}
            estimatedItemSize={275}
          />
        </ErrorBoundary>
      </View>
    </View>
  );
};
