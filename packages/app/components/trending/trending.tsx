import { useCallback, useMemo, createContext, useContext } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { TrendingCard } from "app/components/card/trending-card";
import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScrollbarSize } from "app/hooks/use-scrollbar-size";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

const MOBILE_HEADER_HEIGHT = 88;

const Header = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      <View tw="flex-row justify-between bg-white py-4 dark:bg-black">
        <Text tw="text-sm font-bold text-gray-900 dark:text-white">
          Trending
        </Text>
      </View>
    </>
  );
};
export const Trending = () => {
  const { height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const bottomBarHeight = usePlatformBottomHeight();
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
        <TrendingCard
          nft={item}
          showClaimButton
          as={getNFTSlug(item)}
          href={`${getNFTSlug(
            item
          )}?initialScrollIndex=${index}&filter=all&type=trendingNFTs`}
          index={index}
        />
      );
    },
    []
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View tw="mx-auto max-w-screen-xl flex-row justify-center pt-20 md:px-4">
          <Spinner />
        </View>
      );
    }
    return (
      <EmptyPlaceholder title={"No drops, yet."} tw="h-[50vh]" hideLoginBtn />
    );
  }, [isLoading]);

  return (
    <View tw="min-h-screen w-full bg-white dark:bg-black">
      <View tw="max-w-screen-content mx-auto w-full px-4">
        <ErrorBoundary>
          <InfiniteScrollList
            useWindowScroll={isMdWidth}
            data={list}
            preserveScrollPosition
            keyExtractor={keyExtractor}
            numColumns={2}
            renderItem={renderItem}
            style={{
              height: screenHeight - bottomBarHeight - MOBILE_HEADER_HEIGHT,
            }}
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={Header}
            estimatedItemSize={225}
          />
        </ErrorBoundary>
      </View>
    </View>
  );
};
