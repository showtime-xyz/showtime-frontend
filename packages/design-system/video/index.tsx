import { ComponentProps, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Video as ExpoVideo, ResizeMode } from "expo-av";
import { Source } from "react-native-fast-image";

import { Image } from "@showtime-xyz/universal.image";
import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

import { useVideoConfig } from "app/context/video-config-context";
import { useViewabilityMount } from "app/hooks/use-viewability-mount";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, blurhash, style, posterSource, ...props }: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const videoConfig = useVideoConfig();

  const { id } = useViewabilityMount({ videoRef, source: props.source });

  return (
    <>
      <View style={[style, tailwind.style(tw)]}>
        {videoConfig?.previewOnly ? (
          <Image
            tw={tw}
            style={StyleSheet.absoluteFill}
            blurhash={blurhash}
            source={posterSource as Source}
          />
        ) : (
          <>
            <Image
              tw={tw}
              style={StyleSheet.absoluteFill}
              blurhash={blurhash}
              source={posterSource as Source}
            />

            <ExpoVideo
              ref={videoRef}
              style={StyleSheet.absoluteFill}
              useNativeControls={videoConfig?.useNativeControls}
              resizeMode={ResizeMode.COVER}
              posterSource={posterSource}
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
