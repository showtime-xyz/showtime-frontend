import { useCallback, useRef, useMemo } from "react";
import { useWindowDimensions, Platform, StyleSheet } from "react-native";

import {
  InfiniteScrollList,
  ListRenderItemInfo,
} from "@showtime-xyz/universal.infinite-scroll-list";

import { ErrorBoundary } from "app/components/error-boundary";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useFeed } from "app/hooks/use-feed";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { LeanView } from "../creator-channels/components/lean-text";
import { EmptyPlaceholder } from "../empty-placeholder";
import { ListHeaderComponent } from "./header";
import { HomeItem, HomeItemSketelon } from "./home-item";
import { PopularCreators } from "./popular-creators";
import { TrendingCarousel } from "./trending-carousel";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const Home = () => {
  const bottomBarHeight = usePlatformBottomHeight();
  const headerHeight = useHeaderHeight();
  const { width, height } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
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
            <PopularCreators />
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
      <LeanView tw="mt-6 px-4 md:px-0" style={{ height: height - 200 }}>
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
      </LeanView>
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

  const homeStyle = useMemo(
    () => ({
      paddingTop: Platform.select({
        android: 0,
        default: headerHeight,
      }),
    }),
    [headerHeight]
  );

  const bottomOffsetStyle = useMemo(
    () => ({
      marginBottom: Platform.select({
        native: bottomBarHeight,
      }),
    }),
    [bottomBarHeight]
  );
  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <LeanView
        tw="w-full flex-1 items-center bg-white dark:bg-black"
        style={bottomOffsetStyle}
      >
        <LeanView tw="md:max-w-screen-content w-full">
          <ErrorBoundary>
            <ViewabilityInfiniteScrollList
              data={data}
              renderItem={renderItem}
              estimatedItemSize={600}
              drawDistance={Platform.OS === "android" ? height : undefined}
              preserveScrollPosition
              ListHeaderComponent={ListHeaderComponent}
              contentContainerStyle={homeStyle}
              automaticallyAdjustContentInsets
              automaticallyAdjustsScrollIndicatorInsets
              ref={listRef}
              getItemType={getItemType}
              ListEmptyComponent={ListEmptyComponent}
              useWindowScroll
              style={styles.fg}
            />
          </ErrorBoundary>
        </LeanView>
      </LeanView>
    </VideoConfigContext.Provider>
  );
};

const styles = StyleSheet.create({
  fg: {
    flexGrow: 1,
  },
});
