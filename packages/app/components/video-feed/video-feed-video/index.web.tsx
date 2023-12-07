import { useRef, useContext } from "react";

import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import {
  ViewabilityItemsContext,
  ItemKeyContext,
} from "app/hocs/with-viewability-infinite-scroll-list";
import { useMuted } from "app/providers/mute-provider";

import { VideoProps } from "./type";

export const FeedVideo = (props: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useMuted();
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const { height, width, uri, aspectRatio } = props;

  const play = () => {
    videoRef.current?.play();
    videoRef.current?.setAttribute("data-visible", "true");
  };

  const setSrc = () => {
    if (videoRef.current?.src !== uri) {
      videoRef.current?.setAttribute("src", uri);
      videoRef.current?.setAttribute("preload", "auto");
    }
  };

  const unsetSrc = () => {
    videoRef.current?.removeAttribute("src");
    videoRef.current?.removeAttribute("preload");
  };

  const pause = () => {
    videoRef.current?.pause();
    videoRef.current?.removeAttribute("data-visible");
  };

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (isItemInList) {
        // Only load the video if it's in the sliding viewport
        if (ctx[0] === id || ctx[1] === id || ctx[2] === id) {
          runOnJS(setSrc)();
        } else {
          runOnJS(unsetSrc)();
        }

        if (ctx[1] === id) {
          runOnJS(play)();
        } else {
          runOnJS(pause)();
        }
      }
    },
    [id, isItemInList, context, uri]
  );
  const resizeMode = aspectRatio > 0.65 ? "contain" : "cover";

  return (
    <div
      onClick={() => {
        if (muted) {
          setMuted(false);
        }
      }}
    >
      <video
        style={{
          width,
          height,
          objectFit: resizeMode,
        }}
        playsInline
        controls={false}
        ref={videoRef}
        muted={muted}
      />

      <div
        style={{
          width: props.width,
          height: props.height,
          position: "absolute",
        }}
      />
    </div>
  );
};
