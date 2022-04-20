import { ComponentProps, useRef } from "react";
import { StyleSheet } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { useVideoConfig } from "app/context/video-config-context";
import { useItemVisible } from "app/hooks/use-viewability-mount";

import { Image } from "design-system/image";
import type { TW } from "design-system/tailwind/types";
import { View } from "design-system/view";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, blurhash, style, resizeMode, ...props }: VideoProps) {
  const videoConfig = useVideoConfig();

  const videoRef = useRef<ExpoVideo>();
  // useItemVisible({ videoRef });

  return (
    <View>
      {videoConfig?.previewOnly ? (
        <Image
          //@ts-ignore
          source={props.posterSource}
          tw={tw}
          resizeMode={resizeMode}
          blurhash={blurhash}
        />
      ) : (
        <>
          <Image
            // @ts-ignore
            source={props.posterSource}
            style={StyleSheet.absoluteFill}
            tw={tw}
            resizeMode={resizeMode}
            blurhash={blurhash}
          />

          <ExpoVideo
            style={StyleSheet.absoluteFill}
            useNativeControls={videoConfig?.useNativeControls}
            resizeMode="cover"
            posterSource={props.posterSource}
            source={props.source}
            ref={videoRef}
            shouldPlay
            isMuted={videoConfig?.isMuted}
            {...props}
          />
        </>
      )}
    </View>
  );
}

export { Video };
