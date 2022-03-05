import { RefObject, useContext, useEffect, useRef, useState } from "react";

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

  const mount = () => {
    if (!loaded.current) {
      videoRef.current?.loadAsync(source, {
        shouldPlay: true,
        isLooping: true,
        isMuted: videoConfig?.isMuted,
      });
      if (__DEV__) console.log("📽 : loading ", id);
    }
    loaded.current = true;
  };

  const unmount = () => {
    if (loaded.current) {
      videoRef.current?.unloadAsync();
      if (__DEV__) console.log("📽 : unloading ", id);
    }
    loaded.current = false;
  };

  // we mount or unmount the Video depending on the focus state
  useEffect(() => {
    if (isItemInList) {
      if (!isListFocused) {
        unmount();
      } else if (context.value.includes(id)) {
        mount();
      }
    }
  }, [isItemInList, isListFocused, id]);

  // we mount or unmount the Video depending on the list visibility state
  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (isItemInList && ctx.includes(id)) {
        runOnJS(mount)();
      } else if (isItemInList && !ctx.includes(id)) {
        runOnJS(unmount)();
      }
    },
    []
  );

  return {
    id,
  };
};
