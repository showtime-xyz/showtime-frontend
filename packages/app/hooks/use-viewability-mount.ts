import { useContext, useEffect, useState } from "react";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";
import { useIsTabFocused } from "design-system/tabs/tablib";
import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/components/viewability-tracker-flatlist";

export const useViewabilityMount = () => {
  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const [mounted, setMounted] = useState(false);
  let isListFocused = useIsTabFocused();

  const mount = () => {
    if (!mounted) {
      setMounted(true);
    }
  };

  const unmount = () => {
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
    mounted,
    id,
  };
};
