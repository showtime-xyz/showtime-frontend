import { useCallback, useMemo, useRef } from "react";
import { Dimensions, Platform, useWindowDimensions } from "react-native";

import { toggleColorScheme } from "@showtime-xyz/universal.color-scheme";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";

import { FeedItem } from "app/components/feed-item";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import {
  useFocusEffect,
  useScrollToTop,
} from "app/lib/react-navigation/native";
import type { NFT } from "app/types";

const { height: screenHeight } = Dimensions.get("screen");

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

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
  const listRef = useRef<any>(null);
  const isDark = useIsDarkMode();
  const headerHeight = useHeaderHeight();
  useScrollToTop(listRef);
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight } = useWindowDimensions();
  const momentumScrollCallback = useRef(undefined);
  const setMomentumScrollCallback = useCallback((cb: any) => {
    momentumScrollCallback.current = cb;
  }, []);

  const itemHeight = Platform.select({
    web: windowHeight,
    android: safeAreaFrameHeight - headerHeight,
    default: screenHeight,
  });

  const renderItem = useCallback(
    ({ item }: { item: NFT }) => (
      <FeedItem
        nft={item}
        {...{
          itemHeight,
          bottomPadding,
          setMomentumScrollCallback,
        }}
      />
    ),
    [itemHeight, bottomPadding, setMomentumScrollCallback]
  );

  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );
  useFocusEffect(
    useCallback(() => {
      // The reason for adding setTimeout is that the profile screen has a useFocusEffect hook, which will be affected by this hook.
      setTimeout(() => {
        toggleColorScheme(true);
      }, 100);
      return () => {
        toggleColorScheme(isDark);
      };
    }, [isDark])
  );

  const extendedState = useMemo(() => ({ bottomPadding }), [bottomPadding]);

  if (data.length === 0) return null;

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityInfiniteScrollList
        data={data}
        onEndReached={fetchMore}
        initialScrollIndex={initialScrollIndex}
        showsVerticalScrollIndicator={false}
        ref={listRef}
        onRefresh={refresh}
        extraData={extendedState}
        onMomentumScrollEnd={momentumScrollCallback.current}
        refreshing={isRefreshing}
        pagingEnabled
        renderItem={renderItem}
        estimatedItemSize={itemHeight}
      />
    </VideoConfigContext.Provider>
  );
};
