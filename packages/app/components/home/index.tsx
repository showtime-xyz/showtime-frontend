import { useCallback, useRef, useMemo } from "react";
import { useWindowDimensions, Platform } from "react-native";

import {
  InfiniteScrollList,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { View } from "@showtime-xyz/universal.view";

import { TopCreatorTokens } from "app/components/creator-token/top-creator-token";
import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useFeed } from "app/hooks/use-feed";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { Sticky } from "app/lib/stickynode";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../empty-placeholder";
import { ListHeaderComponent } from "./header";
import { HomeItem, HomeItemSketelon } from "./home-item";
import { TrendingCarousel } from "./trending-carousel";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);
const RIGHT_SIDE_WIDTH = 300;
export const Home = () => {
  const bottomBarHeight = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const isLgWidth = width >= breakpoints["xl"];

  const { data, isLoading } = useFeed();
  const listRef = useRef<any>();
  useScrollToTop(listRef);

  const feedItemLength = data?.length ?? 0;
  const mediaSize = isMdWidth ? 500 : width - 48 - 56;
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT>) => {
      if (index === 0) {
        return (
          <>
            <HomeItem nft={item} mediaSize={mediaSize} index={index} />
          </>
        );
      }

      // New logic for carousel that shows every 25% of the feed
      if (index % Math.floor(feedItemLength * 0.25) === 0 && index !== 0) {
        return (
          <>
            <HomeItem nft={item} mediaSize={mediaSize} index={index} />
            <TrendingCarousel />
          </>
        );
      }

      return <HomeItem nft={item} mediaSize={mediaSize} index={index} />;
    },
    [mediaSize, feedItemLength]
  );

  const ListEmptyComponent = useCallback(() => {
    return (
      <View tw="mt-6 px-4 md:px-0" style={{ height: height - 200 }}>
        {isLoading ? (
          <>
            <HomeItemSketelon mediaSize={mediaSize} />
            <HomeItemSketelon mediaSize={mediaSize} />
          </>
        ) : (
          <EmptyPlaceholder
            title={"No drops, yet."}
            tw="h-[50vh] pt-32"
            hideLoginBtn
          />
        )}
      </View>
    );
  }, [height, isLoading, mediaSize]);

  const getItemType = useCallback(
    (_: NFT, index: number) => {
      if (index === 0) {
        return "popularCreators";
      }

      if (index % Math.floor(feedItemLength * 0.25) === 0 && index !== 0) {
        return "trendingCarousel";
      }

      return "homeItem";
    },
    [feedItemLength]
  );
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );
  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <View
        tw="w-full flex-1 flex-row justify-center bg-white dark:bg-black"
        style={{
          marginBottom: Platform.select({
            native: bottomBarHeight,
          }),
        }}
      >
        <View tw="md:max-w-screen-content w-full">
          <ErrorBoundary>
            <ViewabilityInfiniteScrollList
              data={data}
              renderItem={renderItem}
              estimatedItemSize={600}
              drawDistance={Platform.OS === "android" ? height : undefined}
              preserveScrollPosition
              ListHeaderComponent={ListHeaderComponent}
              contentContainerStyle={{
                paddingTop: Platform.select({
                  android: 0,
                  default: headerHeight,
                }),
              }}
              automaticallyAdjustContentInsets
              automaticallyAdjustsScrollIndicatorInsets
              ref={listRef}
              getItemType={getItemType}
              ListEmptyComponent={ListEmptyComponent}
              useWindowScroll
              style={{ flexGrow: 1 }}
            />
          </ErrorBoundary>
        </View>
        {isLgWidth ? (
          <View tw="" style={{ width: RIGHT_SIDE_WIDTH, marginLeft: 200 }}>
            <TopCreatorTokens isSimplified limit={15} disableFetchMore />
          </View>
        ) : null}
      </View>
    </VideoConfigContext.Provider>
  );
};
