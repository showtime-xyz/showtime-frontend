import { ComponentProps, useRef, forwardRef } from "react";

import { Video as ExpoVideo } from "expo-av";

import { useItemVisible } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

type VideoProps = ComponentProps<typeof ExpoVideo>;

export const Video = forwardRef<ExpoVideo, VideoProps>(function Video(
  props: VideoProps,
  ref
) {
  const videoRef = useRef<ExpoVideo | null>(null);

  const { id } = useItemVisible({ videoRef });
  const [muted] = useMuted();
  const isMuted = muted;

  return (
    <ExpoVideo
      ref={(innerRef) => {
        if (videoRef) {
          videoRef.current = innerRef;
        }
        if (ref) {
          // @ts-ignore
          ref.current = innerRef;
        }
      }}
      shouldPlay={typeof id === "undefined"}
      isLooping
      isMuted={isMuted}
      {...props}
    />
  );
});
