import { Platform } from "react-native";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

import { videos } from "../../../../apps/video-data";
import { VideoFeedItem } from "./video-feed-item";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const VideoFeedList = () => {
  const size = useSafeAreaFrame();
  const bottomBarHeight = usePlatformBottomHeight();
  const videoDimensions =
    Platform.OS === "web"
      ? {
          width: "100%",
          height: `calc(100vh - ${bottomBarHeight}px)`,
        }
      : {
          width: size.width,
          height: size.height - bottomBarHeight,
        };

  return (
    <View style={{ flex: 1 }}>
      <ViewabilityInfiniteScrollList
        useWindowScroll={false}
        data={videos}
        estimatedItemSize={size.height}
        pagingEnabled
        snapToOffsets={
          Platform.OS !== "web"
            ? [256].concat(
                // @ts-ignore
                videos.map((_, i) => i * videoDimensions.height + 256)
              )
            : undefined
        }
        decelerationRate="fast"
        renderItem={({ item, index }) =>
          index === 0 ? (
            <View tw="h-[256px] w-full bg-red-500" nativeID="3434" />
          ) : (
            <VideoFeedItem video={item} videoDimensions={videoDimensions} />
          )
        }
      />
    </View>
  );
};
