import { forwardRef } from "react";

import { Video as ExpoVideo, ResizeMode } from "expo-av";

import { VideoProps } from "./type";

export const Video = forwardRef(function Video(props: VideoProps, ref: any) {
  const {
    width,
    height,
    uri,
    resizeMode,
    muted,
    loop,
    autoPlay = false,
  } = props;

  return (
    <ExpoVideo
      ref={ref}
      shouldPlay={autoPlay}
      source={uri ? ({ uri } as { uri: string }) : undefined}
      isLooping={loop}
      isMuted={muted}
      resizeMode={
        resizeMode === "cover" ? ResizeMode.COVER : ResizeMode.CONTAIN
      }
      style={{
        width,
        height,
      }}
      videoStyle={{
        width,
        height,
      }}
    />
  );
});
