import { Gesture } from "react-native-gesture-handler";
import { SharedValue, useSharedValue } from "react-native-reanimated";

import { handleGestureOnEnd, handleGestureOnUpdate } from "./utils";

type useGestureHandlerProps = {
  startX: SharedValue<number>;
  offsetX: SharedValue<number>;
  offsetY?: SharedValue<number>;
};

const useGestureHandler = ({
  startX,
  offsetX,
  offsetY,
}: useGestureHandlerProps) => {
  const destination = useSharedValue(0);

  const swipeableProviderGesture = Gesture.Pan()
    .onStart((e) => {})
    .onUpdate((e) => {
      handleGestureOnUpdate({
        e,
        startX,
        offsetX,
        offsetY,
      });
    })
    .onEnd((e) => {
      handleGestureOnEnd({
        e,
        startX,
        offsetX,
        offsetY,
        destination,
      });
    });

  return { swipeableProviderGesture };
};

export default useGestureHandler;
