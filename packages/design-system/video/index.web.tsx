import { ComponentProps, useRef } from "react";
import { StyleSheet, ImageBackground, ImageSourcePropType } from "react-native";

import { Video as ExpoVideo } from "expo-av";
import { BlurView, BlurTint } from "expo-blur";
import { ImageStyle, Source } from "react-native-fast-image";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Image } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";

import { useVideoConfig } from "app/context/video-config-context";
import { useItemVisible } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
  width: number;
  height: number;
} & ComponentProps<typeof ExpoVideo>;

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
          source={posterSource as Source}
          width={width}
          height={height}
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
            source={posterSource as Source}
            width={width}
            height={height}
          />
          <BlurView
            style={StyleSheet.absoluteFill}
            tint={colorScheme as BlurTint}
            intensity={85}
          />
          <ExpoVideo
            style={[StyleSheet.absoluteFill, { justifyContent: "center" }]}
            useNativeControls={videoConfig?.useNativeControls}
            resizeMode={resizeMode}
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
