import { useCallback } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
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

import {
  TopCreatorTokenListItem,
  TopCreatorTokenListItemSkeleton,
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
      <View tw="hidden flex-row justify-between pb-4 pt-4 md:flex">
        <Text tw="text-base font-bold text-gray-900 dark:text-white md:text-xl">
          Top Creator Tokens
        </Text>
      </View>
    </>
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
              <TopCreatorTokenListItemSkeleton key={i} isMdWidth={isMdWidth} />
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
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}
        overscan={12}
        ListHeaderComponent={Header}
        containerTw="px-4"
        onEndReached={disableFetchMore ? () => {} : fetchMore}
        ListEmptyComponent={ListEmptyComponent}
        estimatedItemSize={46}
      />
    </ErrorBoundary>
  );
};
