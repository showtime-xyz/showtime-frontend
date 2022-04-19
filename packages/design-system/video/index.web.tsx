import { ComponentProps, useRef } from "react";
import { StyleSheet } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { useVideoConfig } from "app/context/video-config-context";
import { useItemVisible } from "app/hooks/use-viewability-mount";

import { Image } from "design-system/image";
import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";
import { View } from "design-system/view";

type VideoProps = {
  tw?: TW;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, style, ...props }: VideoProps) {
  const videoConfig = useVideoConfig();

  const videoRef = useRef<ExpoVideo>();
  useItemVisible({ videoRef });

  return (
    <View style={[style, tailwind.style(tw)]}>
      {videoConfig?.previewOnly ? (
        <Image style={StyleSheet.absoluteFill} source={props.posterSource} />
      ) : (
        <>
          <Image
            //@ts-ignore
            source={props.posterSource}
            style={StyleSheet.absoluteFill}
          />

          <ExpoVideo
            style={StyleSheet.absoluteFill}
            useNativeControls={videoConfig?.useNativeControls}
            resizeMode="cover"
            posterSource={props.posterSource}
            source={props.source}
            ref={videoRef}
            isMuted={videoConfig?.isMuted}
            {...props}
          />
        </>
      )}
    </View>
  );
}

export { Video };
