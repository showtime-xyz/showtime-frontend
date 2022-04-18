import { PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { SharedValue, withSpring } from "react-native-reanimated";

import {
  MIN_VELOCITY_Y_TO_ACTIVATE,
  SNAP_POINTS_HORIZONTAL_AS_ARRAY,
  SPRING_CONFIG,
  SCREEN_WIDTH,
} from "./constants";

type handleOnUpdateHorizontalProps = {
  e: PanGestureHandlerEventPayload;
  startX: SharedValue<number>;
  offsetX: SharedValue<number>;
};

const getNextSnapPoint = (offset: number) => {
  "worklet";

  let nextSnapPointAvailable = false;
  let snapPoint = 0;

  for (let i = 0; i < 5; i += 2) {
    if (
      offset <= SNAP_POINTS_HORIZONTAL_AS_ARRAY[i - 1] &&
      offset >= SNAP_POINTS_HORIZONTAL_AS_ARRAY[i + 1]
    ) {
      snapPoint = SNAP_POINTS_HORIZONTAL_AS_ARRAY[i];
      nextSnapPointAvailable = true;
    }
  }

  return nextSnapPointAvailable ? snapPoint : 0;
};

export const handleOnEndHorizontal = ({
  e,
  startX,
  offsetX,
}: handleOnUpdateHorizontalProps & {
  destination: SharedValue<number>;
}) => {
  "worklet";

  const velocity = Math.abs(e.velocityX);
  const nextXValue =
    e.translationX < 0
      ? offsetX.value - SCREEN_WIDTH
      : offsetX.value + SCREEN_WIDTH;

  startX.value = startX.value + e.translationX;
  let nextSnapPoint;

  if (velocity > MIN_VELOCITY_Y_TO_ACTIVATE) {
    nextSnapPoint = getNextSnapPoint(nextXValue);
    if (nextSnapPoint !== -1) {
      offsetX.value = withSpring(nextSnapPoint, {
        ...SPRING_CONFIG,
        velocity,
      });
      startX.value = withSpring(nextSnapPoint, {
        ...SPRING_CONFIG,
        velocity,
      });
    }
  } else {
    nextSnapPoint = getNextSnapPoint(offsetX.value + e.translationX);
    offsetX.value = withSpring(nextSnapPoint, {
      ...SPRING_CONFIG,
      velocity,
    });
    startX.value = withSpring(nextSnapPoint, {
      ...SPRING_CONFIG,
      velocity,
    });
  }
};
