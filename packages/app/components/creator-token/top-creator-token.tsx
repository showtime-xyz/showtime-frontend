import { useCallback } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Lock,
  LockBadge,
  LockRounded,
  LockV2,
} from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import {
  TopCreatorTokenUser,
  useTopCreatorToken,
} from "app/hooks/creator-token/use-creator-tokens";
import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { breakpoints } from "design-system/theme";

import { ListHeaderComponent } from "../home/header";
import {
  TopCreatorTokenListItem,
  TopCreatorTokenListItemSkeleton,
} from "./creator-token-users";

const Header = () => {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const isDark = useIsDarkMode();
  return (
    <View
      style={{
        paddingTop: Platform.select({
          ios: headerHeight + 8,
          default: 8,
        }),
      }}
      tw="border-b border-gray-200 pb-4 dark:border-gray-700"
    >
      <ListHeaderComponent />
      <View tw="flex-row items-center justify-between px-4 py-4">
        <Text tw="text-lg font-bold text-gray-900 dark:text-white">
          Trending
        </Text>
      </View>
      <View tw="flex-row items-center px-4">
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
  );
};
const keyExtractor = (item: TopCreatorTokenUser) => `${item.id}`;
export const TopCreatorTokens = ({
  isSimplified,
  disableFetchMore,
  limit,
}: {
  isSimplified?: boolean;
  disableFetchMore?: boolean;
  limit?: number;
}) => {
  const { height: screenHeight, width } = useWindowDimensions();
  const { data: list, isLoading, fetchMore } = useTopCreatorToken(limit);
  const isMdWidth = width >= breakpoints["md"];
  const numColumns = 1;

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
          style={{ paddingHorizontal: 16 }}
        />
      );
    },
    [isSimplified, isMdWidth]
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View>
          {new Array(6).fill(0).map((_, i) => {
            return (
              <TopCreatorTokenListItemSkeleton
                style={{ paddingHorizontal: 16 }}
                key={i}
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

  return (
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
        overscan={20}
        ListHeaderComponent={Header}
        onEndReached={disableFetchMore ? () => {} : fetchMore}
        ListEmptyComponent={ListEmptyComponent}
        estimatedItemSize={46}
      />
    </ErrorBoundary>
  );
};
