import { ComponentProps } from "react";

import { Video as ExpoVideo, ResizeMode } from "expo-av";

import type { TW } from "@showtime-xyz/universal.tailwind";

type VideoProps = {
  tw?: TW;
  blurhash?: string;
} & ComponentProps<typeof ExpoVideo>;

export function ListVideo({ posterSource, ...props }: VideoProps) {
  return (
    <>
      <ExpoVideo
        {...props}
        style={{ width: "100%", height: "100%" }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        posterSource={posterSource}
        shouldPlay={true}
        isMuted={true}
        isLooping={true}
      />
    </>
  );
}
