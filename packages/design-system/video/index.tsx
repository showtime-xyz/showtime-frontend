import { ComponentProps, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Video as ExpoVideo } from "expo-av";
import FastImage from "react-native-fast-image";

import { useViewabilityMount } from "app/hooks/use-viewability-mount";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

type VideoProps = {
  tw?: TW;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, style, ...props }: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);
  // const [readyToPlay, setReadyToPlay] = useState(false);

  useViewabilityMount({ videoRef, source: props.source });

  return (
    <>
      <View style={[style, tailwind.style(tw)]}>
        <ExpoVideo
          ref={videoRef}
          style={StyleSheet.absoluteFill}
          useNativeControls={true}
          resizeMode="cover"
          // onReadyForDisplay={() => setReadyToPlay(true)}
        />
        {/* {!readyToPlay && props.posterSource ? (
          <FastImage
            //@ts-ignore
            source={props.posterSource}
            style={StyleSheet.absoluteFill}
          />
        ) : null} */}
      </View>
    </>
  );
}

export { Video };
