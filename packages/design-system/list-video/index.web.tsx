import { useRef, forwardRef } from "react";
import { StyleSheet } from "react-native";

import {
  Video as ExpoVideo,
  VideoProps as AVVideoProps,
  ResizeMode as AVResizeMode,
} from "expo-av";

import { ResizeMode } from "@showtime-xyz/universal.image";
import type { TW } from "@showtime-xyz/universal.tailwind";

import { useItemVisible } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

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

export const ListVideo = forwardRef(function ListVideo(
  { resizeMode, posterSource, ...props }: VideoProps,
  ref
) {
  const videoRef = useRef<ExpoVideo | null>(null);
  const { id } = useItemVisible({ videoRef });
  const [muted] = useMuted();
  const isMuted = props.isMuted ?? muted;

  return (
    <div style={{ height: "inherit", width: "inherit" }}>
      <ExpoVideo
        style={[StyleSheet.absoluteFill, { justifyContent: "center" }]}
        useNativeControls={false}
        resizeMode={contentFitToresizeMode(resizeMode)}
        posterSource={posterSource}
        source={props.source}
        shouldPlay={typeof id === "undefined"}
        isLooping
        videoStyle={{ position: "relative" }}
        {...props}
        ref={(innerRef) => {
          if (videoRef) {
            videoRef.current = innerRef;
          }
          if (ref) {
            // @ts-ignore
            ref.current = innerRef;
          }
        }}
        isMuted={isMuted}
      />
    </div>
  );
});
