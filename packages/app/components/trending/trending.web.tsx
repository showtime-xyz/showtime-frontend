import { useCallback, useMemo, createContext, useContext } from "react";
import { useWindowDimensions } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";
import chunk from "lodash/chunk";

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
import { createParam } from "app/navigation/use-param";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

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

  return (
    <View tw="mx-auto w-full max-w-screen-xl">
      <View tw="w-full flex-row justify-center self-center px-4 py-4 md:justify-between md:pb-8">
        <Text tw="font-space-bold self-center text-lg font-extrabold text-gray-900 dark:text-white md:text-2xl">
          Trending
        </Text>
      </View>
      <TabBarSingle
        onPress={(index: number) => {
          setDays(TRENDING_ROUTE[index].key);
        }}
        routes={TRENDING_ROUTE}
        index={TRENDING_ROUTE.findIndex((item) => item.key == days)}
        disableScrollableBar={!isMdWidth}
      />
    </View>
  );
};
export const Trending = () => {
  const { height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const bottomBarHeight = usePlatformBottomHeight();
  const isMdWidth = contentWidth >= breakpoints["md"];
  const numColumns =
    contentWidth <= breakpoints["md"]
      ? 3
      : contentWidth >= breakpoints["lg"]
      ? 3
      : 2;
  const [days, setDays] = useParam("days", { initial: "1" });

  const { data: list, isLoading } = useTrendingNFTS({
    days: Number(days),
  });
  const chuckList = useMemo(() => {
    return chunk(list, numColumns);
  }, [list, numColumns]);
  const keyExtractor = useCallback(
    (_item: NFT[], index: number) => `${index}`,
    []
  );

  const renderItem = useCallback(
    ({
      item: chuckItem,
      index: itemIndex,
    }: ListRenderItemInfo<NFT[] & { loading?: boolean }>) => {
      return (
        <View
          tw="mx-auto mb-px flex-row space-x-px px-0 md:space-x-6 md:px-6 lg:space-x-8 lg:px-4 xl:px-0"
          style={{ maxWidth: contentWidth }}
        >
          {chuckItem.map((item, chuckItemIndex) => (
            <Card
              key={item.nft_id}
              nft={item}
              numColumns={numColumns}
              href={`/list?initialScrollIndex=${
                itemIndex * numColumns + chuckItemIndex
              }&days=${days}&type=trendingNFTs`}
            />
          ))}
          {chuckItem.length < numColumns &&
            new Array(numColumns - chuckItem.length)
              .fill(0)
              .map((_, itemIndex) => (
                <View key={itemIndex.toString()} tw="flex-1" />
              ))}
        </View>
      );
    },
    [contentWidth, days, numColumns]
  );
  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <EmptyPlaceholder title={"No results found"} tw="h-[50vh]" hideLoginBtn />
    );
  }, [isLoading]);

  return (
    <TrendingHeaderContext.Provider
      value={{
        days: days,
        setDays: setDays,
      }}
    >
      <View tw="w-full pb-8 md:pt-20">
        <ErrorBoundary>
          <InfiniteScrollList
            useWindowScroll={isMdWidth}
            ListHeaderComponent={Header}
            data={chuckList}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={contentWidth / numColumns}
            overscan={{
              main: contentWidth / numColumns,
              reverse: contentWidth / numColumns,
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
