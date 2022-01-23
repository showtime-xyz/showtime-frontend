import { ComponentProps, useRef, useState } from "react";
import { Video as ExpoVideo } from "expo-av";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";
import { usePlayVideoOnVisible } from "app/components/VisibilityTrackerFlatlist";

type VideoProps = {
  tw?: TW;
  nftId?: string;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, nftId, style, ...props }: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);
  usePlayVideoOnVisible(videoRef);

  return (
    <ExpoVideo
      ref={videoRef}
      style={[style, tailwind.style(tw)]}
      isMuted
      useNativeControls={false}
      resizeMode="cover"
      {...props}
    />
  );
}

export { Video };
