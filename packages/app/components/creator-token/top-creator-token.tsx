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

import {
  TopCreatorTokenItem,
  TopCreatorTokenSkeleton,
} from "./creator-token-users";

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

const keyExtractor = (item: CreatorTokenUser) => `${item.profile_id}`;
export const TopCreatorTokens = () => {
  const { height: screenHeight } = useWindowDimensions();
  const { data: list, isLoading } = useCreatorTokenCollectors(27);

  const numColumns = 1;

  const renderItem = useCallback(
    ({
      item,
      index,
    }: ListRenderItemInfo<CreatorTokenUser & { loading?: boolean }>) => {
      return <TopCreatorTokenItem item={item} index={index} showName />;
    },
    []
  );

  const ListEmptyComponent = useCallback(() => {
    if (!isLoading) {
      return (
        <View>
          {new Array(6).fill(0).map((_, i) => {
            return <TopCreatorTokenSkeleton key={i} />;
          })}
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
            data={list || []}
            preserveScrollPosition
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            renderItem={renderItem}
            drawDistance={500}
            style={{
              height: Platform.select({
                web: undefined,
                default: screenHeight,
              }),
            }}
            contentContainerStyle={{
              paddingHorizontal: 12,
            }}
            overscan={12}
            containerTw="px-4 md:px-0"
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={Header}
            estimatedItemSize={46}
          />
        </ErrorBoundary>
      </View>
    </View>
  );
};
