import { ComponentProps, useRef } from "react";
import { Platform } from "react-native";

import { Video as ExpoVideo, ResizeMode } from "expo-av";

import { Image } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { useVideoConfig } from "app/context/video-config-context";
import { useViewabilityMount } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
  loading?: "eager" | "lazy";
} & ComponentProps<typeof ExpoVideo>;

export function ListVideo({ posterSource, ...props }: VideoProps) {
  const videoConfig = useVideoConfig();
  const videoRef = useRef<ExpoVideo | null>(null);
  const [muted] = useMuted();
  const isMuted = props.isMuted ?? muted;
  const { id } = useViewabilityMount({
    videoRef,
    source: props.source,
    isMuted: isMuted,
  });

  // this is a temporary fix for the video on android due to expo-av performance issues
  if (Platform.OS === "android" || videoConfig?.previewOnly) {
    return (
      <Image
        source={posterSource}
        // @ts-ignore
        recyclingKey={posterSource?.uri}
        data-test-id={Platform.select({ web: "nft-card-media" })}
        resizeMode={ResizeMode.COVER}
        alt={"Video Poster"}
        style={{ height: "100%", width: "100%" }}
      />
    );
  }
  return (
    <>
      <ExpoVideo
        {...props}
        ref={videoRef}
        style={{ width: "100%", height: "100%" }}
        resizeMode={ResizeMode.COVER}
        posterSource={posterSource}
        shouldPlay={true}
        isMuted={true}
        isLooping
        useNativeControls={videoConfig?.useNativeControls}
      />
      {__DEV__ ? (
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "white",
            position: "absolute",
          }}
        >
          Video {id}
        </Text>
      ) : null}
    </>
  );
}
