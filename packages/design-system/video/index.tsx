import { ComponentProps, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { useVideoConfig } from "app/context/video-config-context";
import { useViewabilityMount } from "app/hooks/use-viewability-mount";

import { Image } from "design-system/image";
import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, blurhash, style, ...props }: VideoProps) {
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
            // @ts-ignore
            source={props.posterSource}
          />
        ) : (
          <>
            <Image
              tw={tw}
              style={StyleSheet.absoluteFill}
              blurhash={blurhash}
              // @ts-ignore
              source={props.posterSource}
            />

            <ExpoVideo
              ref={videoRef}
              style={StyleSheet.absoluteFill}
              useNativeControls={videoConfig?.useNativeControls}
              resizeMode="cover"
              posterSource={props.posterSource}
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
