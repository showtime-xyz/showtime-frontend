import { StyleSheet } from "react-native";

import {
  Video as ExpoVideo,
  VideoProps as AVVideoProps,
  ResizeMode as AVResizeMode,
} from "expo-av";

import { ResizeMode } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

type VideoProps = Omit<AVVideoProps, "resizeMode"> & {
  tw?: TW;
  blurhash?: string;
  width: number;
  height: number;
  resizeMode: ResizeMode;
  loading?: "eager" | "lazy";
};
const contentFitToresizeMode = (resizeMode: ResizeMode) => {
  switch (resizeMode) {
    case "cover":
      return AVResizeMode.COVER;
    case "contain":
      return AVResizeMode.CONTAIN;
    default:
      return AVResizeMode.STRETCH;
  }
};

export function ListVideo({ resizeMode, posterSource, ...props }: VideoProps) {
  return (
    <View style={{ height: "inherit", width: "inherit" }}>
      <ExpoVideo
        style={[StyleSheet.absoluteFill, { justifyContent: "center" }]}
        useNativeControls={false}
        resizeMode={contentFitToresizeMode(resizeMode)}
        posterSource={posterSource}
        source={props.source}
        shouldPlay={true}
        isLooping
        isMuted={true}
        videoStyle={{ position: "relative" }}
        {...props}
      />
    </View>
  );
}
