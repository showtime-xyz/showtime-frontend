import { Platform } from "react-native";

import { ResizeMode } from "expo-av";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";

import { Video } from "design-system/video";

import { videos } from "../../../apps/video-data";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const VideoFeed = () => {
  const size = useSafeAreaFrame();

  const videoDimensions =
    Platform.OS === "web"
      ? {
          width: "100%",
          height: "100vh",
        }
      : {
          width: size.width,
          height: size.height,
        };
  return (
    <View tw="h-screen w-screen">
      <ViewabilityInfiniteScrollList
        useWindowScroll={false}
        data={videos}
        estimatedItemSize={200}
        pagingEnabled
        snapToOffsets={[256].concat(
          videos.map((_, i) => i * size.height + 256)
        )}
        decelerationRate="fast"
        renderItem={({ item, index }) =>
          index === 0 ? (
            <View tw="h-[256px] w-full border-2 bg-red-400" />
          ) : (
            <View
              tw="items-center justify-center border-2"
              //@ts-ignore
              style={videoDimensions}
            >
              <FeedVideo video={item} />
            </View>
          )
        }
      />
    </View>
  );
};

const FeedVideo = ({ video }: any) => {
  const size = useSafeAreaFrame();

  const videoDimensions =
    Platform.OS === "web"
      ? {
          width: "100%",
          height: "100vh",
        }
      : {
          width: size.width,
          height: size.height,
        };

  return (
    <Video
      source={{ uri: video.sources[0] }}
      // @ts-ignore
      style={videoDimensions}
      // @ts-ignore
      videoStyle={videoDimensions}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
    />
  );
};
