import { useMemo, useRef, useCallback } from "react";
import { useWindowDimensions } from "react-native";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";

import { FeedItem } from "app/components/feed-item";
import { VideoConfigContext } from "app/context/video-config-context";
import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useScrollToTop } from "app/lib/react-navigation/native";
import type { NFT } from "app/types";

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
  const headerHeight = useHeaderHeight();
  useScrollToTop(listRef);
  const { height: windowHeight } = useWindowDimensions();

  const itemHeight = windowHeight - headerHeight;
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: NFT }) => (
      <FeedItem
        nft={item}
        {...{
          itemHeight,
          bottomPadding,
        }}
      />
    ),
    [itemHeight, bottomPadding]
  );

  if (data.length === 0) return null;

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <ViewabilityInfiniteScrollList
        data={data}
        estimatedItemSize={windowHeight}
        onEndReached={fetchMore}
        refreshing={isRefreshing}
        onRefresh={refresh}
        initialScrollIndex={initialScrollIndex}
        ref={listRef}
        overscan={{
          main: itemHeight,
          reverse: itemHeight,
        }}
        renderItem={renderItem}
      />
    </VideoConfigContext.Provider>
  );
};
