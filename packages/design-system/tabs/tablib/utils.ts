import { PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { cancelAnimation, SharedValue } from "react-native-reanimated";

import { handleOnEndHorizontal } from "./calculations";

type GestureHandlerProps = {
  e: PanGestureHandlerEventPayload;
  offsetY?: SharedValue<number>;
  startX: SharedValue<number>;
  offsetX: SharedValue<number>;
};

export const handleGestureOnUpdate = ({
  offsetX,
  startX,
  e,
}: GestureHandlerProps) => {
  "worklet";
  cancelAnimation(startX);
  offsetX.value = e.translationX + startX.value;
};

export const handleGestureOnEnd = ({
  offsetX,
  startX,
  e,
  destination,
}: GestureHandlerProps & { destination: SharedValue<number> }) => {
  "worklet";
  handleOnEndHorizontal({
    e,
    startX,
    offsetX,
    destination,
  });
};
