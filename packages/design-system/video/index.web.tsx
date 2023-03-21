import { useRef } from "react";
import { StyleSheet, ImageStyle } from "react-native";

import {
  Video as ExpoVideo,
  VideoProps as AVVideoProps,
  ResizeMode as AVResizeMode,
} from "expo-av";

import { useVideoConfig } from "app/context/video-config-context";
import { useItemVisible } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

import { Image, ResizeMode } from "design-system/image";
import type { TW } from "design-system/tailwind";
import { View } from "design-system/view";

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

export function Video({
  tw,
  blurhash,
  style,
  resizeMode,
  posterSource,
  isMuted: isMutedProp,
  width,
  height,
  ...props
}: VideoProps) {
  const videoConfig = useVideoConfig();
  const videoRef = useRef<ExpoVideo>(null);
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
        <View tw="overflow-hidden">
          <View tw="blur-md">
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
          </View>

          <ExpoVideo
            style={[StyleSheet.absoluteFill, { justifyContent: "center" }]}
            useNativeControls={videoConfig?.useNativeControls}
            resizeMode={contentFitToresizeMode(resizeMode)}
            posterSource={posterSource}
            source={props.source}
            ref={videoRef}
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
}
