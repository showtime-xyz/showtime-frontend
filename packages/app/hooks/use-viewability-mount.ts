import { RefObject, useCallback, useContext, useEffect, useRef } from "react";

import { Video } from "expo-av";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";
import { useIsFocused } from "app/lib/react-navigation/native";

export const useViewabilityMount = ({
  videoRef,
  source,
  isMuted,
}: {
  videoRef: RefObject<Video>;
  source: any;
  isMuted: boolean;
}) => {
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";

  const loaded = useRef(false);
  let isScreenFocused = useIsFocused();

  const loadPlayOrPause = useCallback(
    async (shouldPlay: boolean) => {
      // if (__DEV__) console.log("📽 : loading ", shouldPlay, id, source.uri);
      if (!loaded.current) {
        await videoRef.current?.loadAsync(source, {
          isLooping: true,
          isMuted,
        });
      }

      if (shouldPlay) {
        videoRef.current?.playAsync();
      } else {
        videoRef.current?.pauseAsync();
      }

      loaded.current = true;
    },
    [source, videoRef, isMuted]
  );

  const unload = useCallback(() => {
    if (loaded.current) {
      videoRef.current?.unloadAsync();
    }
    loaded.current = false;
  }, [videoRef]);

  // we mount or unmount the Video depending on the focus state
  useEffect(() => {
    if (isItemInList) {
      if (!isScreenFocused) {
        loadPlayOrPause(false);
      } else if (context.value.includes(id)) {
        const shouldPlay = context.value[1] === id;
        loadPlayOrPause(shouldPlay);
      }
    }
  }, [
    isItemInList,
    unload,
    isScreenFocused,
    id,
    context.value,
    loadPlayOrPause,
  ]);

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      // e.g. window = [0, 1, 2]
      // load video [0, 1, 2] in the player, play 1 and pause 0 and 2
      if (isItemInList && ctx.includes(id)) {
        const shouldPlay = ctx[1] === id;
        runOnJS(loadPlayOrPause)(shouldPlay);
      } else if (isItemInList && !ctx.includes(id)) {
        runOnJS(unload)();
      }
    },
    [id, loadPlayOrPause, isItemInList, unload]
  );

  return {
    id,
  };
};

// web only
export const useItemVisible = ({ videoRef }: { videoRef: any }) => {
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";

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
    [id, isItemInList]
  );

  return {
    id,
  };
};
