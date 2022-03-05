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
  const { id, mounted } = useViewabilityMount();
  const isItemInList = typeof id !== "undefined";
  const [readyToPlay, setReadyToPlay] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setReadyToPlay(false);
    }
  }, [mounted]);

  // if video is in nft view we play it
  if (!isItemInList) {
    return (
      <ExpoVideo
        ref={videoRef}
        style={[style, tailwind.style(tw)]}
        isMuted
        isLooping
        useNativeControls={true}
        resizeMode="cover"
        // shouldPlay={true}
        source={props.source}
        posterSource={props.posterSource}
      />
    );
  }

  return (
    <>
      <View style={[style, tailwind.style(tw)]}>
        {/* {__DEV__ ? (
          <Text
            style={{
              position: "absolute",
              fontSize: 24,
              fontWeight: "900",
              color: "green",
              zIndex: 99,
            }}
          >
            {mounted && readyToPlay ? "true " + id : "false " + id}
          </Text>
        ) : null} */}

        {mounted ? (
          <ExpoVideo
            ref={videoRef}
            style={StyleSheet.absoluteFill}
            isMuted
            useNativeControls={true}
            resizeMode="cover"
            // shouldPlay
            source={props.source}
            isLooping
            onReadyForDisplay={() => setReadyToPlay(true)}
          />
        ) : null}

        {!readyToPlay && props.posterSource ? (
          <FastImage
            //@ts-ignore
            source={props.posterSource}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
      </View>
    </>
  );
}

export { Video };
