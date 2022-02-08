import { ComponentProps } from "react";
import { Video as ExpoVideo } from "expo-av";

import type { TW } from "design-system/tailwind/types";

type VideoProps = {
  tw?: TW;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, style, ...props }: VideoProps) {
  return (
    <ExpoVideo
      isMuted
      useNativeControls={false}
      resizeMode="cover"
      shouldPlay
      source={props.source}
      {...props}
    />
  );
}

export { Video };
