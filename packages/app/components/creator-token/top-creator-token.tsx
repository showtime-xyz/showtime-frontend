import { useCallback, useRef } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { LockV2 } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import Spinner from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import {
  CreatorTokenItem,
  NewCreatorTokenItem,
  TopCreatorTokenUser,
  useTopCreatorToken,
} from "app/hooks/creator-token/use-creator-tokens";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";

import { breakpoints } from "design-system/theme";

import { ListHeaderComponent } from "../home/header";
import {
  TopCreatorTokenListItem,
  TopCreatorTokenListItemSkeleton,
} from "./creator-token-users";

const Header = () => {
  const isDark = useIsDarkMode();
  return (
    <>
      <ListHeaderComponent />
      <View tw="px-4 md:px-0">
        <View tw=" border-b border-gray-200 pb-4 dark:border-gray-700">
          <View tw="flex-row items-center justify-between pb-4 pt-6">
            <Text tw="text-gray-1100 text-lg font-bold dark:text-white">
              Welcome to the creator economy.
            </Text>
          </View>
          <View tw="flex-row items-center">
            <LockV2
              width={14}
              height={14}
              color={isDark ? colors.white : colors.gray[900]}
            />
            <View tw="w-1" />
            <Text tw="text-sm font-medium text-gray-900 dark:text-white">
              Collect at least 1 token to unlock their channel.
            </Text>
          </View>
        </View>
        <View tw="flex-row items-center pb-2 pt-4">
          <Text
            tw="w-[24px] text-xs text-gray-600 dark:text-gray-500"
            style={{
              fontSize: 11,
            }}
          >
            #
          </Text>
          <Text
            tw="w-[186px] text-xs text-gray-600 dark:text-gray-500 md:w-[208px]"
            style={{
              fontSize: 11,
            }}
          >
            CREATOR
          </Text>
          <Text
            tw="ml-10 text-xs text-gray-600 dark:text-gray-500"
            style={{
              fontSize: 11,
            }}
          >
            COLLECTED
          </Text>
          <Text
            tw="hidden text-xs text-gray-600 dark:text-gray-500 lg:block"
            style={{
              fontSize: 11,
              marginLeft: 92,
            }}
          >
            LAST MESSAGE
          </Text>
        </View>
      </View>
    </>
  );
};
const keyExtractor = (item: TopCreatorTokenUser) =>
  `${
    (item as CreatorTokenItem)?.id
      ? (item as CreatorTokenItem)?.id
      : (item as NewCreatorTokenItem)?.creator_token.id
  }`;
export const TopCreatorTokens = ({
  isSimplified,
  disableFetchMore,
  limit,
}: {
  isSimplified?: boolean;
  disableFetchMore?: boolean;
  limit?: number;
}) => {
  const headerHeight = useHeaderHeight();
  const { height: screenHeight, width } = useWindowDimensions();
  const {
    data: list,
    isLoading,
    fetchMore,
    isLoadingMore,
    refresh,
    isRefreshing,
  } = useTopCreatorToken(limit);
  const isMdWidth = width >= breakpoints["md"];
  const numColumns = 1;
  const listRef = useRef<any>();
  useScrollToTop(listRef);
  const renderItem = useCallback(
    ({
      item,
      index,
    }: ListRenderItemInfo<TopCreatorTokenUser & { loading?: boolean }>) => {
      return (
        <TopCreatorTokenListItem
          item={item}
          index={index}
          isSimplified={isSimplified}
          isMdWidth={isMdWidth}
          tw="px-4 md:px-0"
        />
      );
    },
    [isSimplified, isMdWidth]
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View>
          {new Array(20).fill(0).map((_, index) => {
            return (
              <TopCreatorTokenListItemSkeleton
                tw="px-4 md:px-0"
                key={index}
                isMdWidth={isMdWidth}
              />
            );
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
  }, [isLoading, isMdWidth]);

  const renderListFooter = useCallback(() => {
    if (isLoadingMore && !isLoading) {
      return (
        <View tw="w-full items-center py-4">
          <Spinner size="small" />
        </View>
      );
    }
    return null;
  }, [isLoading, isLoadingMore]);

  return (
    <ErrorBoundary>
      <InfiniteScrollList
        useWindowScroll
        data={list || []}
        ref={listRef}
        preserveScrollPosition
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        refreshing={isRefreshing}
        onRefresh={refresh}
        renderItem={renderItem}
        drawDistance={500}
        style={{
          height: Platform.select({
            web: undefined,
            default: screenHeight - headerHeight,
          }),
          paddingTop: Platform.select({
            ios: headerHeight,
            default: 0,
          }),
        }}
        overscan={28}
        ListHeaderComponent={Header}
        onEndReached={disableFetchMore ? () => {} : fetchMore}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={renderListFooter}
        estimatedItemSize={46}
      />
    </ErrorBoundary>
  );
};
