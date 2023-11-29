import { useRef, useContext } from "react";

import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import { Video } from "app/components/video";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/hocs/with-viewability-infinite-scroll-list";
import { useMuted } from "app/providers/mute-provider";

import { VideoProps } from "./type";

export const FeedVideo = (props: VideoProps) => {
  const videoRef = useRef<any>(null);
  const [muted] = useMuted();
  const { width, height, uri } = props;

  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";

  const play = () => {
    videoRef.current?.play();
  };

  const pause = () => {
    videoRef.current?.pause();
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
      uri={uri}
      ref={videoRef}
      resizeMode="cover"
      muted={muted}
      loop
    />
  );
};
