import { ComponentProps, useRef } from "react";
import { StyleSheet } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useVideoConfig } from "app/context/video-config-context";

import { Image } from "design-system/image";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, blurhash, resizeMode, ...props }: VideoProps) {
  const videoConfig = useVideoConfig();

  const videoRef = useRef<ExpoVideo>();
  // useItemVisible({ videoRef });

  return (
    <View>
      {videoConfig?.previewOnly ? (
        <Image
          tw={tw}
          resizeMode={resizeMode}
          blurhash={blurhash}
          //@ts-ignore
          source={props.posterSource}
        />
      ) : (
        <>
          <Image
            tw={tw}
            style={StyleSheet.absoluteFill}
            resizeMode={resizeMode}
            blurhash={blurhash}
            // @ts-ignore
            source={props.posterSource}
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
