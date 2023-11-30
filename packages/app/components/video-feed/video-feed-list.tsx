import { Platform } from "react-native";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { withViewabilityInfiniteScrollList } from "app/hocs/with-viewability-infinite-scroll-list";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

import { VideoFeedItem } from "./video-feed-item";

const ViewabilityInfiniteScrollList =
  withViewabilityInfiniteScrollList(InfiniteScrollList);

const data = [
  1,
  {
    id: "08eb9e1c-c907-4206-80c0-3fec9a0d30e9",
    profile: {
      verified: true,
      bio: "👋 https://google.com @showtime",
      profile_id: 3366447,
      name: "Nishan Bende",
      username: "nishanbende",
      wallet_address: "0xA550A45D61ddc231AFA3242fb6aF0908044b735b",
      wallet_address_nonens: "0xA550A45D61ddc231AFA3242fb6aF0908044b735b",
      img_url:
        "https://lh3.googleusercontent.com/AEnH2_JXVpF55uZc0WWhws48yF2TXccF5HbCrz7BXfmPgQQFMr_gDBsQHY6Y5zXT7T_OLz6pQpdr9BML3oIGfUqzI989xPrr3AN4",
    },
    description: "Home!",
    media: {
      width: 1280,
      height: 720,
      length: 31,
      urls: {
        direct:
          "https://video.bunnycdn.com/play/114828/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4",
        original:
          "https://video-stage.showtime.xyz/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4/original",
        hls_playlist:
          "https://video-stage.showtime.xyz/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4/playlist.m3u8",
        thumbnail:
          "https://video-stage.showtime.xyz/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4/thumbnail.jpg",
        optimized_thumbnail:
          "https://video-stage.showtime.xyz/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4/thumbnail_4.jpg",
        preview_animation:
          "https://video-stage.showtime.xyz/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4/preview.webp",
        mp4_720:
          "https://video-stage.showtime.xyz/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4/play_720p.mp4",
        mp4_480: null,
        mp4_360:
          "https://video-stage.showtime.xyz/0e7c6ce5-0ad0-42ff-b68b-6df3a8249fe4/play_360p.mp4",
        mp4_240: null,
      },
    },
    deleted_at: null,
    created_at: "2023-11-30T14:11:01.582Z",
    updated_at: "2023-11-30T14:11:01.582Z",
    view_count: 1,
    creator_token_id: 55,
    creator_token_address: "0xC46D2ad301F5d3Df810Ef39af26a55Bc2Fb576EE",
    creator_channel_id: 97,
  },
];

export const VideoFeedList = () => {
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
        estimatedItemSize={size.height}
        pagingEnabled
        snapToOffsets={data.map(
          (_, i) =>
            // @ts-ignore
            i * videoDimensions.height
        )}
        decelerationRate="fast"
        renderItem={({ item, index }) =>
          index === 0 ? (
            <View tw="h-[256px] w-full bg-gray-500" nativeID="3434" />
          ) : (
            <VideoFeedItem video={item} videoDimensions={videoDimensions} />
          )
        }
      />
    </View>
  );
};
