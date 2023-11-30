import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";

import { videos } from "../../../../apps/video-data";
import { VideoFeedItem } from "./video-feed-item";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const VideoFeedList = () => {
  const size = useSafeAreaFrame();

  return (
    <View style={{ flex: 1 }}>
      <ViewabilityInfiniteScrollList
        useWindowScroll={false}
        data={videos}
        estimatedItemSize={size.height}
        pagingEnabled
        snapToOffsets={[256].concat(
          videos.map((_, i) => i * size.height + 256)
        )}
        decelerationRate="fast"
        renderItem={({ item, index }) =>
          index === 0 ? (
            <View tw="h-[256px] w-full bg-red-500" nativeID="3434" />
          ) : (
            <VideoFeedItem video={item} />
          )
        }
      />
    </View>
  );
};
