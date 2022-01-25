import { useContext, useEffect, useState } from "react";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";
import { useIsTabFocused } from "design-system/tabs/tablib";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "./viewability-tracker-flatlist";

export const usePlayVideoOnVisible = () => {
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const [mounted, setMounted] = useState(false);
  let isListFocused = useIsTabFocused();

  const playVideo = () => {
    if (!mounted) {
      setMounted(true);
    }
  };

  const pauseVideo = () => {
    if (mounted) {
      setMounted(false);
    }
  };

  // we mount or unmount the Video depending on the focus state
  useEffect(() => {
    if (isItemInList) {
      if (!isListFocused) {
        setMounted(false);
      } else if (context.value.includes(id)) {
        setMounted(true);
      }
    }
  }, [isItemInList.valueOf, isListFocused, id]);

  // we mount or unmount the Video depending on the list visibility state
  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (isItemInList && ctx.includes(id)) {
        runOnJS(playVideo)();
      } else if (isItemInList && !ctx.includes(id)) {
        runOnJS(pauseVideo)();
      }
    },
    []
  );

  return {
    mounted,
    id,
  };
};
