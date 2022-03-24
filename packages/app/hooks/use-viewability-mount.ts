import { RefObject, useCallback, useContext, useEffect, useRef } from "react";

import { Video } from "expo-av";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";

import { useIsTabFocused } from "design-system/tabs/tablib";

import { useVideoConfig } from "../context/video-config-context";

export const useViewabilityMount = ({
  videoRef,
  source,
}: {
  videoRef: RefObject<Video>;
  source: any;
}) => {
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const loaded = useRef(false);
  const videoConfig = useVideoConfig();
  let isListFocused = useIsTabFocused();

  const loadPlayOrPause = useCallback(
    async (shouldPlay) => {
      // if (__DEV__) console.log("📽 : loading ", shouldPlay, id, source.uri);
      if (!loaded.current) {
        await videoRef.current?.loadAsync(source, {
          isLooping: true,
          isMuted: videoConfig?.isMuted,
        });
      }

      if (shouldPlay) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }

      loaded.current = true;
    },
    [source, videoRef]
  );

  const unload = useCallback(() => {
    if (loaded.current) {
      videoRef.current?.unloadAsync();
      // if (__DEV__) console.log("📽 : unloading ", id);
    }
    loaded.current = false;
  }, [videoRef, id]);

  // we mount or unmount the Video depending on the focus state
  useEffect(() => {
    if (isItemInList) {
      if (!isListFocused) {
        unload();
      } else if (context.value.includes(id)) {
        const shouldPlay = context.value[1] === id;
        loadPlayOrPause(shouldPlay);
      }
    }
  }, [isItemInList, unload, isListFocused, id]);

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
