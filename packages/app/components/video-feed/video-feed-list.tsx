import { Platform } from "react-native";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { VideoPost } from "app/types";

import { VideoFeedItem } from "./video-feed-item";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const VideoFeedList = (props: {
  data?: VideoPost[];
  initialScrollIndex?: number;
}) => {
  const { data, initialScrollIndex = 0 } = props;
  const size = useSafeAreaFrame();
  const bottomBarHeight = usePlatformBottomHeight();
  const videoDimensions =
    Platform.OS === "web"
      ? {
          width: "100%",
          height: `calc(100dvh - ${bottomBarHeight}px)`,
        }
      : {
          width: size.width,
          height: size.height - bottomBarHeight,
        };

  return (
    <View style={{ flex: 1, paddingBottom: bottomBarHeight }}>
      <ViewabilityInfiniteScrollList
        useWindowScroll={false}
        data={data}
        overscan={12}
        estimatedItemSize={Platform.select({
          web: typeof window !== "undefined" ? window.innerHeight : 0,
          default: videoDimensions.height as number,
        })}
        initialScrollIndex={initialScrollIndex}
        pagingEnabled
        snapToOffsets={data?.map(
          (_, i) =>
            // @ts-ignore
            i * videoDimensions.height
        )}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <VideoFeedItem video={item} videoDimensions={videoDimensions} />
        )}
      />
    </View>
  );
};
