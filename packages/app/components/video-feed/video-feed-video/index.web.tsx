import { useRef, useContext } from "react";

import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import { Video } from "app/components/video";
import {
  ViewabilityItemsContext,
  ItemKeyContext,
} from "app/hocs/with-viewability-infinite-scroll-list";
import { useMuted } from "app/providers/mute-provider";

import { VideoProps } from "./type";

export const FeedVideo = (props: VideoProps) => {
  const videoRef = useRef<any>(null);

  const [muted] = useMuted();
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const { height, width, uri } = props;

  const play = () => {
    videoRef.current?._nativeRef?.current._video?.play();
  };

  const pause = () => {
    videoRef.current?._nativeRef.current._video?.pause();
  };

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (isItemInList) {
        if (ctx[1] === id) {
          runOnJS(play)();
        } else {
          runOnJS(pause)();
        }
      }
    },
    [id, isItemInList, context]
  );

  return (
    <Video
      // @ts-ignore
      height={height}
      // @ts-ignore
      width={width}
      ref={videoRef}
      resizeMode="cover"
      uri={uri}
      muted={muted}
      loop
    />
  );
};
