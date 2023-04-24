import { useCallback, useMemo, createContext, useContext } from "react";
import { useWindowDimensions } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ListCard } from "app/components/card/list-card";
import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScrollbarSize } from "app/hooks/use-scrollbar-size";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { Link } from "app/navigation/link";
import { createParam } from "app/navigation/use-param";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { TRENDING_ROUTE } from "./tabs";

type Query = {
  tab: "creator" | "drop";
  filter: string;
};

const TrendingHeaderContext = createContext<{
  filter: string | undefined;
  setFilter: (type: string) => void;
}>({
  filter: undefined,
  setFilter: () => {},
});
const { useParam } = createParam<Query>();
const Header = () => {
  const context = useContext(TrendingHeaderContext);
  const { filter, setFilter } = context;
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const tabIndex = useMemo(() => {
    const index = TRENDING_ROUTE.findIndex((item) => item.key === filter);
    if (index === -1) {
      return 0;
    }
    return index;
  }, [filter]);
  return (
    <View tw="mx-auto mb-4 w-full max-w-screen-xl">
      <View tw="w-full flex-row justify-center px-4 py-4 md:hidden">
        <Text tw="text-lg font-extrabold text-gray-900 dark:text-white">
          Trending
        </Text>
      </View>
      <View tw="mx-12 my-4 hidden items-center md:flex">
        <Text tw="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Earn free collectibles for supporting artists.
        </Text>
        <View tw="mt-8 flex-row items-center">
          <Link
            href="https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688"
            target="_blank"
          >
            <Image
              source={{
                uri: isDark
                  ? "/assets/AppStoreDark.png"
                  : "/assets/AppStoreLight.png",
              }}
              width={144}
              height={42}
              tw="rounded-md duration-150 hover:scale-105"
              alt="App Store"
            />
          </Link>
          <View tw="w-8" />
          <Link
            href="https://play.google.com/store/apps/details?id=io.showtime"
            target="_blank"
          >
            <Image
              source={{
                uri: isDark
                  ? "/assets/GooglePlayDark.png"
                  : "/assets/GooglePlayLight.png",
              }}
              width={144}
              height={42}
              tw="rounded-md duration-150 hover:scale-105"
              alt="Google Play"
            />
          </Link>
        </View>
      </View>

      <View tw="web:min-h-[43px]">
        <TabBarSingle
          onPress={(index: number) => {
            setFilter(TRENDING_ROUTE[index].key);
          }}
          routes={TRENDING_ROUTE}
          index={tabIndex}
          disableScrollableBar={!isMdWidth}
        />
      </View>
    </View>
  );
};
const INITIAL_FILTER = "music";
export const Trending = () => {
  const { height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const bottomBarHeight = usePlatformBottomHeight();
  const { width } = useScrollbarSize();
  const isMdWidth = contentWidth + width > breakpoints["md"];

  const [filter, setFilter] = useParam("filter", { initial: INITIAL_FILTER });

  const contextValues = useMemo(
    () => ({ filter: filter, setFilter }),
    [filter, setFilter]
  );

  const { data: list, isLoading } = useTrendingNFTS({
    filter: filter ?? INITIAL_FILTER,
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
            as={getNFTSlug(item)}
            href={`${getNFTSlug(
              item
            )}?initialScrollIndex=${index}&filter=${filter}&type=trendingNFTs`}
            index={index}
          />
        </View>
      );
    },
    [filter]
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
    <TrendingHeaderContext.Provider value={contextValues}>
      <View tw="w-full pb-8 md:pt-20">
        <ErrorBoundary>
          <InfiniteScrollList
            useWindowScroll={isMdWidth}
            ListHeaderComponent={Header}
            data={list}
            preserveScrollPosition
            keyExtractor={keyExtractor}
            renderItem={renderItem}
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
