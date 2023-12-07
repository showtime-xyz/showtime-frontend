import { useCallback, useRef } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import Spinner from "@showtime-xyz/universal.spinner";
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
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";

import { breakpoints } from "design-system/theme";

import {
  TopCreatorTokenItem,
  TopCreatorTokenListItemSkeleton,
} from "./creator-token-users";

const Header = () => {
  return (
    <View tw="my-2">
      <Text tw="p-2 text-lg font-semibold text-gray-600 dark:text-gray-500">
        Leaderboard
      </Text>
    </View>
  );
};
const keyExtractor = (item: TopCreatorTokenUser) =>
  `${
    (item as CreatorTokenItem)?.id
      ? (item as CreatorTokenItem)?.id
      : (item as NewCreatorTokenItem)?.creator_token.id
  }`;
export const TopCreatorTokens = ({
  disableFetchMore,
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
  } = useTopCreatorToken();
  const isMdWidth = width >= breakpoints["md"];
  const numColumns = 1;
  const listRef = useRef<any>();
  useScrollToTop(listRef);
  const renderItem = useCallback(
    ({
      item,
      index,
    }: ListRenderItemInfo<TopCreatorTokenUser & { loading?: boolean }>) => {
      return <TopCreatorTokenItem item={item} index={index} />;
    },
    []
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
        useWindowScroll={false}
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
          padding: 4,
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
