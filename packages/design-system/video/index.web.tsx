import { ComponentProps } from "react";
import { StyleSheet } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { useVideoConfig } from "app/context/video-config-context";

import { Image } from "design-system/image";
import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";
import { View } from "design-system/view";

type VideoProps = {
  tw?: TW;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, style, ...props }: VideoProps) {
  const videoConfig = useVideoConfig();

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
            shouldPlay
            resizeMode="cover"
            posterSource={props.posterSource}
            source={props.source}
            isMuted
            {...props}
          />
        </>
      )}
    </View>
  );
}

export { Video };
