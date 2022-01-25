import { ComponentProps, useRef, useState } from "react";
import { Video as ExpoVideo } from "expo-av";
import FastImage from "react-native-fast-image";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";
import { usePlayVideoOnVisible } from "app/components/VisibilityTrackerFlatlist";
import { Text, View } from "react-native";

type VideoProps = {
  tw?: TW;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, style, ...props }: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const { id, mounted } = usePlayVideoOnVisible(videoRef, props.source);
  const isItemInList = typeof id !== "undefined";

  return (
    <>
      <View>
        <Text
          style={{
            position: "absolute",
            fontSize: 24,
            fontWeight: "900",
            color: "green",
            zIndex: 99,
          }}
        >
          {mounted ? "true" : "false"}
        </Text>

        {mounted ? (
          <ExpoVideo
            ref={videoRef}
            style={[style, tailwind.style(tw)]}
            isMuted
            useNativeControls={true}
            resizeMode="cover"
            shouldPlay={true}
            source={props.source}
            posterSource={props.posterSource}
          />
        ) : (
          <FastImage
            source={props.posterSource}
            style={[style, tailwind.style(tw)]}
          />
        )}
      </View>
    </>
  );
}

export { Video };
