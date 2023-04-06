import { forwardRef, useRef } from "react";
import { StyleSheet, ImageStyle } from "react-native";

import {
  Video as ExpoVideo,
  VideoProps as AVVideoProps,
  ResizeMode as AVResizeMode,
} from "expo-av";

import { Image, ResizeMode } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useVideoConfig } from "app/context/video-config-context";
import { useItemVisible } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

type VideoProps = Omit<AVVideoProps, "resizeMode"> & {
  tw?: TW;
  blurhash?: string;
  width: number;
  height: number;
  resizeMode: ResizeMode;
};
const contentFitToresizeMode = (resizeMode: ResizeMode) => {
  switch (resizeMode) {
    case "cover":
      return AVResizeMode.COVER;
    case "contain":
      return AVResizeMode.CONTAIN;
    default:
      return AVResizeMode.STRETCH;
  }
};

export const Video = forwardRef<ExpoVideo, VideoProps>(function Video(
  {
    tw,
    blurhash,
    style,
    resizeMode,
    posterSource,
    isMuted: isMutedProp,
    width,
    height,
    ...props
  }: VideoProps,
  ref
) {
  const videoRef = useRef<ExpoVideo | null>(null);

  const videoConfig = useVideoConfig();
  const { id } = useItemVisible({ videoRef });
  const [muted] = useMuted();
  const isMuted = isMutedProp ?? muted;

  return (
    <>
      {videoConfig?.previewOnly ? (
        <Image
          tw={tw}
          style={style as ImageStyle}
          resizeMode={resizeMode}
          blurhash={blurhash}
          source={posterSource}
          width={width}
          height={height}
          alt={"Video Poster"}
        />
      ) : (
        <View>
          <Image
            tw={tw}
            style={style as ImageStyle}
            resizeMode={resizeMode}
            blurhash={blurhash}
            source={posterSource}
            width={width}
            height={height}
            alt={"Video Background"}
          />
          <View tw="absolute inset-0 backdrop-blur-md" />
          <ExpoVideo
            style={[StyleSheet.absoluteFill, { justifyContent: "center" }]}
            useNativeControls={videoConfig?.useNativeControls}
            resizeMode={contentFitToresizeMode(resizeMode)}
            posterSource={posterSource}
            source={props.source}
            ref={(innerRef) => {
              if (videoRef) {
                videoRef.current = innerRef;
              }
              if (ref) {
                // @ts-ignore
                ref.current = innerRef;
              }
            }}
            shouldPlay={typeof id === "undefined"}
            isLooping
            isMuted={isMuted}
            videoStyle={{ position: "relative" }}
            {...props}
          />
        </View>
      )}
    </>
  );
});
