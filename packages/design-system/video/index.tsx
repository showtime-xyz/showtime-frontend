import { ComponentProps, useRef } from "react";
import { StyleSheet, Text } from "react-native";

import { Video as ExpoVideo, ResizeMode } from "expo-av";

import { useVideoConfig } from "app/context/video-config-context";
import { useViewabilityMount } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

import { Image } from "design-system/image";
import type { TW } from "design-system/tailwind";
import { View } from "design-system/view";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
  width: number;
  height: number;
} & ComponentProps<typeof ExpoVideo>;

function Video({
  tw,
  blurhash,
  style,
  width,
  height,
  isMuted: isMutedProp,
  posterSource,
  ...props
}: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const videoConfig = useVideoConfig();
  const [muted] = useMuted();

  const isMuted = isMutedProp ?? muted;

  const { id } = useViewabilityMount({
    videoRef,
    source: props.source,
    isMuted: isMuted,
  });

  return (
    <>
      <View style={style} tw={tw}>
        {videoConfig?.previewOnly ? (
          <Image
            tw={tw}
            //@ts-ignore
            width={width}
            height={height}
            blurhash={blurhash}
            source={posterSource as any}
          />
        ) : (
          <>
            <Image
              tw={tw}
              width={width}
              height={height}
              // @ts-ignore
              style={[StyleSheet.absoluteFill, style]}
              blurhash={blurhash}
              source={posterSource as any}
            />

            <ExpoVideo
              ref={videoRef}
              style={StyleSheet.absoluteFill}
              useNativeControls={videoConfig?.useNativeControls}
              resizeMode={ResizeMode.COVER}
              posterSource={posterSource}
              isMuted={isMuted}
            />
          </>
        )}

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
      </View>
    </>
  );
}

export { Video };
