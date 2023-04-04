import { useCallback, useMemo, createContext, useContext } from "react";
import { useWindowDimensions } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { createParam } from "app/navigation/use-param";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { ListCard } from "../card/list-card";
import { TRENDING_ROUTE } from "./tabs";

type Query = {
  tab: "creator" | "drop";
  days: string;
};

const TrendingHeaderContext = createContext<{
  days: string | undefined;
  setDays: (type: string) => void;
}>({
  days: undefined,
  setDays: () => {},
});
const { useParam } = createParam<Query>();
const Header = () => {
  const context = useContext(TrendingHeaderContext);
  const { days, setDays } = context;
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const tabIndex = useMemo(
    () => TRENDING_ROUTE.findIndex((item) => item.key === days),
    [days]
  );

  return (
    <View tw="mx-auto mb-4 w-full max-w-screen-xl">
      <View tw="w-full flex-row justify-center self-center px-4 py-4 md:justify-between md:pb-8">
        <Text tw="self-center text-lg font-extrabold text-gray-900 dark:text-white md:text-2xl">
          Trending
        </Text>
      </View>
      <View tw="web:min-h-[43px]">
        <TabBarSingle
          onPress={(index: number) => {
            setDays(TRENDING_ROUTE[index].key);
          }}
          routes={TRENDING_ROUTE}
          index={tabIndex}
          disableScrollableBar={!isMdWidth}
        />
      </View>
    </View>
  );
};
export const Trending = () => {
  const { height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const bottomBarHeight = usePlatformBottomHeight();
  const isMdWidth = contentWidth >= breakpoints["md"];
  const [days, setDays] = useParam("days", { initial: "1" });
  const contextValues = useMemo(() => ({ days, setDays }), [days, setDays]);

  const { data: list, isLoading } = useTrendingNFTS({
    days: Number(days),
  });

  const keyExtractor = useCallback(
    (_item: NFT, index: number) => `${index}`,
    []
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT & { loading?: boolean }>) => {
      return (
        <View tw="mx-auto max-w-screen-xl flex-row md:px-4">
          <ListCard
            nft={item}
            showClaimButton
            href={`/${getNFTSlug(
              item
            )}?initialScrollIndex=${index}&days=${days}&type=trendingNFTs`}
          />
        </View>
      );
    },
    [days]
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <EmptyPlaceholder title={"No drops, yet."} tw="h-[50vh]" hideLoginBtn />
    );
  }, [isLoading]);

  return (
    <TrendingHeaderContext.Provider value={contextValues}>
      <View tw="w-full pb-8 md:pt-20">
        <ErrorBoundary>
          <InfiniteScrollList
            useWindowScroll={isMdWidth}
            ListHeaderComponent={Header}
            data={list}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={screenHeight}
            overscan={{
              main: screenHeight,
              reverse: screenHeight,
            }}
            style={{
              height: screenHeight - bottomBarHeight,
            }}
            ListEmptyComponent={ListEmptyComponent}
          />
        </ErrorBoundary>
      </View>
    </TrendingHeaderContext.Provider>
  );
};
