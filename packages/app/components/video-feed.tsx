import { Platform } from "react-native";

import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { ChannelLocked, Share } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";

import { Video } from "design-system/video";

import { videos } from "../../../apps/video-data";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

export const VideoFeed = () => {
  const size = useSafeAreaFrame();

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
            <View tw="h-[256px] w-full bg-gray-100" />
          ) : (
            <FeedItem video={item} />
          )
        }
      />
    </View>
  );
};

const FeedItem = ({ video }: any) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View tw="w-full">
      <FeedVideo video={video} />
      <View tw="z-1 absolute bottom-0 w-full">
        <LinearGradient
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: safeAreaInsets.bottom + 16,
            paddingHorizontal: 16,
          }}
          {...fromCSS(
            `linear-gradient(to top,rgba(0,0,0,.4) 0,rgba(0,0,0,0) 160px),linear-gradient(to bottom,rgba(0,0,0,.4) 0,rgba(0,0,0,0) 96px);`
          )}
        >
          <View style={{ rowGap: 12, flex: 3 }}>
            <View tw="flex-row items-center">
              <Avatar size={32} />
              <Text tw="ml-2 mr-4 text-white">lilbubble</Text>
              <Pressable
                tw="rounded-4xl items-center justify-center px-4"
                style={{ backgroundColor: "#08F6CC", height: 30 }}
              >
                <Text>Buy $21.67</Text>
              </Pressable>
            </View>
            <Text
              tw="overflow-hidden whitespace-nowrap text-white"
              numberOfLines={1}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown
            </Text>
          </View>
          <View tw="flex-1 items-end" style={{ rowGap: 16 }}>
            <Pressable tw="items-center" style={{ rowGap: 4 }}>
              <ChannelLocked color="white" width={31} height={28} />
              <Text tw="text-white">139</Text>
            </Pressable>
            <Pressable tw="items-center">
              <Share color="white" width={28} height={28} />
            </Pressable>
          </View>
        </LinearGradient>
      </View>
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
      useNativeControls={false}
      resizeMode={ResizeMode.COVER}
    />
  );
};
