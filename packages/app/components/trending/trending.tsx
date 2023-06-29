import { useCallback } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import {
  TrendingItem,
  TrendingSkeletonItem,
} from "app/components/trending/trending-item";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScrollbarSize } from "app/hooks/use-scrollbar-size";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

const Header = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      <View
        style={{
          height: Platform.select({
            android: 8,
            default: headerHeight + 8,
          }),
        }}
      />
      <View tw="hidden flex-row justify-between bg-white pb-4 pt-6 dark:bg-black md:flex">
        <Text tw="font-bold text-gray-900 dark:text-white md:text-xl">
          Trending
        </Text>
      </View>
    </>
  );
};
export const Trending = () => {
  const { height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const bottom = usePlatformBottomHeight();
  const { width } = useScrollbarSize();
  const isMdWidth = contentWidth + width > breakpoints["md"];

  const { data: list, isLoading } = useTrendingNFTS({});

  const keyExtractor = useCallback(
    (_item: NFT, index: number) => `${index}`,
    []
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT & { loading?: boolean }>) => {
      return (
        <TrendingItem
          nft={item}
          index={index}
          tw="mb-4 px-2.5 md:px-0"
          presetWidth={182}
        />
      );
    },
    []
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View tw="mx-auto w-full max-w-screen-xl justify-center px-4 md:px-0">
          <View tw="flex-row">
            <TrendingSkeletonItem />
            <TrendingSkeletonItem />
            {isMdWidth && <TrendingSkeletonItem />}
          </View>
          <View tw="flex-row">
            <TrendingSkeletonItem />
            <TrendingSkeletonItem />
            {isMdWidth && <TrendingSkeletonItem />}
          </View>
          <View tw="flex-row">
            <TrendingSkeletonItem />
            <TrendingSkeletonItem />
            {isMdWidth && <TrendingSkeletonItem />}
          </View>
          <View tw="flex-row">
            <TrendingSkeletonItem />
            <TrendingSkeletonItem />
            {isMdWidth && <TrendingSkeletonItem />}
          </View>
        </View>
      );
    }
    return (
      <EmptyPlaceholder title={"No drops, yet."} tw="h-[50vh]" hideLoginBtn />
    );
  }, [isLoading, isMdWidth]);

  return (
    <View tw="min-h-screen w-full bg-white dark:bg-black">
      <View tw="md:max-w-screen-content mx-auto w-full">
        <ErrorBoundary>
          <InfiniteScrollList
            useWindowScroll={isMdWidth}
            data={list.slice(0, 9)}
            preserveScrollPosition
            keyExtractor={keyExtractor}
            numColumns={isMdWidth ? 3 : 2}
            renderItem={renderItem}
            style={{
              height: screenHeight - Math.max(bottom, 8),
            }}
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={Header}
            estimatedItemSize={275}
          />
        </ErrorBoundary>
      </View>
    </View>
  );
};
