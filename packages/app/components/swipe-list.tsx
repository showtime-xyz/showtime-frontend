import { useCallback, useMemo, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  useWindowDimensions,
} from "react-native";

import { FlashList } from "@shopify/flash-list";

import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";

import { FeedItem } from "app/components/feed-item";
import {
  MOBILE_WEB_BOTTOM_NAV_HEIGHT,
  MOBILE_WEB_TABS_HEIGHT,
} from "app/constants/layout";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useUser } from "app/hooks/use-user";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import type { NFT } from "app/types";

const { height: screenHeight } = Dimensions.get("screen");

export const ViewabilityTrackerFlashList =
  withViewabilityInfiniteScrollList(FlashList);

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
  const { isAuthenticated } = useUser();
  const listRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  const headerHeightRef = useRef(headerHeight);
  useScrollToTop(listRef);
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight } = useWindowDimensions();
  const momentumScrollCallback = useRef(undefined);
  const setMomentumScrollCallback = useCallback((cb: any) => {
    momentumScrollCallback.current = cb;
  }, []);

  const itemHeight = Platform.select({
    web:
      windowHeight -
      headerHeight -
      (isAuthenticated
        ? MOBILE_WEB_BOTTOM_NAV_HEIGHT + MOBILE_WEB_TABS_HEIGHT
        : 0),
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
          headerHeight: headerHeightRef.current,
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

  const extendedState = useMemo(() => ({ bottomPadding }), [bottomPadding]);

  if (data.length === 0) return null;

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityTrackerFlashList
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
