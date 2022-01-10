import { ComponentProps, useRef, useState } from "react";
import { Video as ExpoVideo } from "expo-av";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

type VideoProps = {
  tw?: TW;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, style, ...props }: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);

  return (
    <ExpoVideo
      ref={videoRef}
      style={[style, tailwind.style(tw)]}
      useNativeControls={false}
      shouldPlay={true}
      isLooping
      isMuted
      resizeMode="cover"
      {...props}
    />
  );
}

export { Video };
