import { useRef } from "react";
import {
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
} from "react-native";

import {
  Video as ExpoVideo,
  VideoProps as AVVideoProps,
  ResizeMode as AVResizeMode,
} from "expo-av";
import { BlurView, BlurTint } from "expo-blur";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Image, ResizeMode } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";

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
  const { colorScheme } = useColorScheme();
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
        <ImageBackground
          source={posterSource as ImageSourcePropType}
          imageStyle={StyleSheet.absoluteFill}
          resizeMode="cover"
        >
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
          <BlurView
            style={StyleSheet.absoluteFill}
            tint={colorScheme as BlurTint}
            intensity={85}
          />
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
        </ImageBackground>
      )}
    </>
  );
}
