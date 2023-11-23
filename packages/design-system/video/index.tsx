import { ComponentProps, useRef, forwardRef } from "react";

import { Video as ExpoVideo } from "expo-av";

import { useViewabilityMount } from "app/hooks/use-viewability-mount";
import { useMuted } from "app/providers/mute-provider";

type VideoProps = ComponentProps<typeof ExpoVideo>;

const Video = forwardRef<ExpoVideo, VideoProps>(function Video(
  { source, ...props }: VideoProps,
  ref
) {
  const videoRef = useRef<ExpoVideo | null>(null);
  const [muted] = useMuted();

  const isMuted = muted;

  useViewabilityMount({
    videoRef,
    source: source,
    isMuted: isMuted,
  });

  return (
    <ExpoVideo
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
  );
});

export { Video };
