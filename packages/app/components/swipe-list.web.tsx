import { useCallback, useMemo, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  useWindowDimensions,
} from "react-native";

import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { tw } from "@showtime-xyz/universal.tailwind";

import { FeedItem } from "app/components/feed-item";
import { MAX_HEADER_WIDTH } from "app/constants/layout";
import { VideoConfigContext } from "app/context/video-config-context";
import { useIsMobileWeb } from "app/hooks/use-is-mobile-web";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import type { NFT } from "app/types";

import { ViewabilityTrackerRecyclerList } from "./viewability-tracker-swipe-list";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
const SCROLL_BAR_WIDTH = 15;

type Props = {
  data: NFT[];
  fetchMore?: () => void;
  isRefreshing?: boolean;
  refresh?: () => void;
  initialScrollIndex?: number;
  bottomPadding?: number;
};

export const SwipeList = ({
  data,
  fetchMore,
  isRefreshing = false,
  refresh,
  initialScrollIndex = 0,
  bottomPadding = 0,
}: Props) => {
  const listRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  useScrollToTop(listRef);
  const { isMobileWeb } = useIsMobileWeb();
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const itemHeight =
    Platform.OS === "web"
      ? windowHeight - headerHeight
      : Platform.OS === "android"
      ? safeAreaFrameHeight - headerHeight
      : screenHeight;

  let dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => {
        return r1.nft_id !== r2.nft_id;
      }).cloneWithRows(data),
    [data]
  );

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        () => {
          return "item";
        },
        (_type, dim) => {
          dim.width = screenWidth;
          dim.height = itemHeight;
        }
      ),
    [itemHeight]
  );

  const _rowRenderer = useCallback(
    (_type: any, item: any) => {
      return (
        <FeedItem
          nft={item}
          {...{
            itemHeight,
            bottomPadding,
          }}
        />
      );
    },
    [itemHeight, bottomPadding]
  );

  const contentWidth = useMemo(() => {
    const scorllBarWidth = isMobileWeb ? 0 : SCROLL_BAR_WIDTH;
    return windowWidth < MAX_HEADER_WIDTH
      ? windowWidth - scorllBarWidth
      : MAX_HEADER_WIDTH;
  }, [windowWidth, isMobileWeb]);

  const layoutSize = useMemo(
    () => ({
      width: contentWidth,
      height: windowHeight,
    }),
    [contentWidth, windowHeight]
  );
  // const ListFooterComponent = useCallback(() => {
  //   const colorMode = useColorScheme();
  //   return isLoadingMore ? (
  //     <View tw="w-full">
  //       <Skeleton height={100} width={screenWidth} colorMode={colorMode} />
  //     </View>
  //   ) : null;
  // }, [isLoadingMore, bottomBarHeight, screenWidth]);

  const scrollViewProps = useMemo(
    () => ({
      pagingEnabled: true,
      showsVerticalScrollIndicator: false,
      refreshControl: (
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      ),
    }),
    [isRefreshing, refresh]
  );

  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const extendedState = useMemo(() => ({ bottomPadding }), [bottomPadding]);

  if (data.length === 0) return null;

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityTrackerRecyclerList
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={_rowRenderer}
        disableRecycling={Platform.OS === "android"}
        ref={listRef}
        initialRenderIndex={initialScrollIndex}
        style={tw.style("flex-1 dark:bg-gray-900 bg-gray-100")}
        renderAheadOffset={itemHeight}
        onEndReached={fetchMore}
        onEndReachedThreshold={itemHeight}
        scrollViewProps={scrollViewProps}
        extendedState={extendedState}
        layoutSize={layoutSize}
      />
    </VideoConfigContext.Provider>
  );
};
