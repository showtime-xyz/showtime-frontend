import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { SNAP_POINTS_HORIZONTAL } from "./constants";
import useGestureHandler from "./useGestureHandler";

const useSwipeableProvider = () => {
  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);
  const { swipeableProviderGesture } = useGestureHandler({
    offsetY,
    offsetX,
    startX,
  });

  const animatedContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetY.value }],
    };
  });

  const animatedTabStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: Math.min(
            Math.max(offsetX.value, SNAP_POINTS_HORIZONTAL.SECOND_PAGE),
            SNAP_POINTS_HORIZONTAL.ORIGIN
          ),
        },
      ],
    };
  }, [offsetX]);

  return {
    offsetY,
    offsetX,
    startX,
    animatedContainerStyles,
    animatedTabStyles,
    swipeableProviderGesture,
  };
};

export default useSwipeableProvider;
