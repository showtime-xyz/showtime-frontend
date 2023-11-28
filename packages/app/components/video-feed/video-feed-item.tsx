import { memo } from "react";
import { StyleSheet, Platform } from "react-native";

import { ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

import { Avatar } from "@showtime-xyz/universal.avatar";
import {
  ChannelLocked,
  Muted,
  Share,
  Unmuted,
} from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useMuted } from "app/providers/mute-provider";

import { CollapsibleText } from "design-system/collapsible-text/collapsible-text";
import { Video } from "design-system/video";

export const VideoFeedItem = memo(function VideoFeedItem({ video }: any) {
  const safeAreaInsets = useSafeAreaInsets();
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
    <View tw="w-full">
      <Video
        source={{ uri: video.sources[0] }}
        // @ts-ignore
        style={videoDimensions}
        // @ts-ignore
        videoStyle={videoDimensions}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
      />
      <View tw="z-1 absolute bottom-0 w-full">
        <LinearGradient
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          start={[1, 0]}
          end={[1, 1]}
          locations={[0.05, 0.8]}
          colors={["rgba(12,12,12,0)", "rgba(12,12,12,.8)"]}
        />
        <View
          tw="flex-1 flex-row items-center justify-between px-4"
          style={{
            paddingBottom: safeAreaInsets.bottom + 32,
          }}
        >
          <View style={{ rowGap: 12, flex: 3 }}>
            <View tw="flex-row items-center">
              <Avatar size={32} />
              <Text tw="ml-2 mr-4 text-white">lilbubble</Text>
              <Pressable
                tw="rounded-4xl items-center justify-center px-4"
                style={{ backgroundColor: "#08F6CC", height: 30 }}
              >
                <Text tw="text-xs font-semibold">Buy $21.67</Text>
              </Pressable>
            </View>
            <CollapsibleText tw="text-white" initialNumberOfLines={1}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown
            </CollapsibleText>
          </View>
          <View tw="flex-1 items-end" style={{ rowGap: 16 }}>
            <MuteButton />
            <Pressable tw="items-center" style={{ rowGap: 4 }}>
              <ChannelLocked color="white" width={31} height={28} />
              <Text tw="text-white">139</Text>
            </Pressable>
            <Pressable tw="items-center">
              <Share color="white" width={28} height={28} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
});

const MuteButton = () => {
  const [muted, setMuted] = useMuted();
  if (Platform.OS !== "web") return null;
  return (
    <Pressable onPress={() => setMuted(!muted)}>
      {muted ? (
        <Muted color="white" width={28} height={28} />
      ) : (
        <Unmuted color="white" width={28} height={28} />
      )}
    </Pressable>
  );
};
