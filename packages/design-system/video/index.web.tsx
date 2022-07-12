import { ComponentProps, useRef, useState } from "react";
import { StyleSheet, ImageBackground, ImageSourcePropType } from "react-native";

import { Video as ExpoVideo, ResizeMode } from "expo-av/src";
import { BlurView, BlurTint } from "expo-blur";
import { Source } from "react-native-fast-image";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Image } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { tw as tailwind } from "@showtime-xyz/universal.tailwind";

import { MuteButton } from "app/components/mute-button";
import { useVideoConfig } from "app/context/video-config-context";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
} & ComponentProps<typeof ExpoVideo>;

export function Video({
  tw,
  blurhash,
  resizeMode,
  posterSource,
  ...props
}: VideoProps) {
  const videoConfig = useVideoConfig();
  const videoRef = useRef<ExpoVideo>(null);
  // useItemVisible({ videoRef });
  const { colorScheme } = useColorScheme();
  const [muted, setMuted] = useState(true);

  return (
    <>
      {videoConfig?.previewOnly ? (
        <Image
          tw={tw}
          resizeMode={resizeMode}
          blurhash={blurhash}
          source={posterSource as Source}
        />
      ) : (
        <ImageBackground
          source={posterSource as ImageSourcePropType}
          imageStyle={StyleSheet.absoluteFill}
          resizeMode="cover"
        >
          <Image
            tw={tw}
            resizeMode={resizeMode}
            blurhash={blurhash}
            source={posterSource as Source}
          />
          <BlurView
            style={StyleSheet.absoluteFill}
            tint={colorScheme as BlurTint}
            intensity={85}
          />
          <ExpoVideo
            style={[StyleSheet.absoluteFill, tailwind.style("justify-center")]}
            useNativeControls={videoConfig?.useNativeControls}
            resizeMode={ResizeMode.COVER}
            posterSource={posterSource}
            source={props.source}
            ref={videoRef}
            shouldPlay
            isLooping
            isMuted={muted}
            videoStyle={tailwind.style("relative")}
            {...props}
          />
          <MuteButton onPress={() => setMuted(!muted)} muted={muted} />
        </ImageBackground>
      )}
    </>
  );
}
