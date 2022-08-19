import { useCallback, useEffect, useState, useMemo } from "react";

import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";

import type { UpdateSceneInfoParams } from "../types";

export const useSceneInfo = (curIndexValue: Animated.SharedValue<number>) => {
  // Are all the fields on the scene ready
  const sceneIsReady = useSharedValue<{ [index: number]: boolean }>({});

  const [childScrollYTrans, setChildScrollYTrans] = useState<{
    [index: number]: Animated.SharedValue<number>;
  }>({});
  const [childScrollRef, setChildScrollRef] = useState<{
    [index: number]: any;
  }>({});

  const updateSceneInfo = useCallback(
    ({ index, scrollRef, scrollY }: UpdateSceneInfoParams) => {
      if (scrollRef && childScrollRef[index] !== scrollRef) {
        setChildScrollRef((preChildRef) => {
          return { ...preChildRef, [index]: scrollRef };
        });
      }

      if (scrollY && childScrollYTrans[index] !== scrollY) {
        setChildScrollYTrans((_p) => {
          return { ..._p, [index]: scrollY };
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childScrollRef]
  );

  const aArray = useMemo(
    () => [childScrollRef, childScrollYTrans],
    [childScrollRef, childScrollYTrans]
  );

  const updateIsReady = useCallback(() => {
    const mIndex = curIndexValue.value;
    const isReady = aArray.every((item) =>
      Object.prototype.hasOwnProperty.call(item, mIndex)
    );

    if (isReady) {
      sceneIsReady.value = {
        ...sceneIsReady.value,
        [mIndex]: isReady,
      };
    }
  }, [aArray, curIndexValue.value, sceneIsReady]);

  // We should call function updateIsReady when the elements in the aArray change
  useEffect(() => {
    updateIsReady();
  }, [updateIsReady]);

  /**
   * If all of the elements in the Aarray have changed, the tabIndex is switched.
   * At this point the above useEffect will not be called again,
   * and we will have to call the updateisReady function again.
   */
  useAnimatedReaction(
    () => {
      return curIndexValue.value;
    },
    () => {
      runOnJS(updateIsReady)();
    },
    [updateIsReady]
  );

  return {
    childScrollRef,
    childScrollYTrans,
    sceneIsReady,
    updateSceneInfo,
  };
};
