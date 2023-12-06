import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { Platform } from "react-native";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { VideoPost } from "app/types";

import { breakpoints } from "design-system/theme";

import { VideoFeedItem } from "./video-feed-item";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const VideoFeedList = (props: {
  data?: VideoPost[];
  initialScrollIndex?: number;
  onEndReached?: () => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
}) => {
  const { data, initialScrollIndex = 0, onEndReached } = props;
  const size = useSafeAreaFrame();
  const bottomBarHeight = usePlatformBottomHeight();
  const listRef = useRef<any>(null);
  useScrollToTop(listRef);

  // Add some padding to the height for desktop screen
  const padding = size.width >= breakpoints["md"] ? 80 : 0;
  const videoHeight = size.height - bottomBarHeight - padding;
  const videoWidth =
    size.width <= breakpoints["md"] ? size.width : videoHeight * (9 / 16);

  const videoDimensions = useMemo(
    () => ({
      width: videoWidth,
      height: videoHeight,
    }),
    [videoWidth, videoHeight]
  );

  const renderItem = useCallback(
    ({ item }: { item: VideoPost }) => (
      <VideoFeedItem post={item} videoDimensions={videoDimensions} />
    ),
    [videoDimensions]
  );

  const [pagingEnabled, setPagingEnabled] = useState(true);

  useEffect(() => {
    if (
      listRef.current &&
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      window.navigator?.userAgent?.includes("Chrome")
    ) {
      listRef.current.addEventListener("scroll", () => {
        if (pagingEnabled) {
          setPagingEnabled(false);
        }
      });
      listRef.current.addEventListener("scrollend", () => {
        if (!pagingEnabled) {
          setPagingEnabled(true);
        }
      });
    }
  }, [pagingEnabled]);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: bottomBarHeight,
      }}
    >
      <ViewabilityInfiniteScrollList
        useWindowScroll={false}
        data={data}
        overscan={3}
        preserveScrollPosition
        onEndReached={onEndReached}
        ListEmptyComponent={() => (
          <View tw="h-full items-center justify-center">
            <Text tw="font-semibold">
              {props.isLoading ? (
                <Skeleton
                  tw="h-full w-full"
                  width={videoDimensions.width}
                  height={videoDimensions.height}
                  show
                />
              ) : (
                "You're all caught up - check back later."
              )}
            </Text>
          </View>
        )}
        estimatedItemSize={Platform.select({
          web: typeof window !== "undefined" ? window.innerHeight : 0,
          default: videoDimensions.height as number,
        })}
        initialScrollIndex={initialScrollIndex}
        pagingEnabled={pagingEnabled}
        ref={listRef}
        //snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        renderItem={renderItem}
        ListFooterComponent={
          props.isLoadingMore && !props.isLoading
            ? () => (
                <View tw="mb-4 items-center justify-center">
                  <Spinner size="small" />
                </View>
              )
            : undefined
        }
      />
    </View>
  );
};
