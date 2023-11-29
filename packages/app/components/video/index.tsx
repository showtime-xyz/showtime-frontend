import { forwardRef } from "react";

import IVSPlayer from "amazon-ivs-react-native-player";

import { VideoProps } from "./type";

const Video = forwardRef(function Video(props: VideoProps, ref: any) {
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
    <IVSPlayer
      style={{ width, height }}
      ref={ref}
      resizeMode={resizeMode === "cover" ? "aspectFill" : "aspectFit"}
      streamUrl={uri as string}
      autoplay={autoPlay}
      loop={loop}
      muted={muted}
    />
  );
});

export { Video };
