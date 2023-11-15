import React from "react";
import { ViewStyle } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Extrapolate,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

export const springConfig: WithSpringConfig = {
  mass: 2,
  stiffness: 1000,
  damping: 500,
  overshootClamping: false,
  restDisplacementThreshold: 0.0005,
};

export function ScreenGesture({
  onClose,
  scale,
  children,
}: {
  onClose: () => void;
  scale: SharedValue<number>;
  children: ({
    translateX,
    translateY,
    scale,
    screenAnimatedStyles,
  }: {
    translateX: SharedValue<number>;
    translateY: SharedValue<number>;
    scale: SharedValue<number>;
    screenAnimatedStyles: ViewStyle;
  }) => React.ReactNode;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onPan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      const scaleX = interpolate(
        translateX.value,
        [-200, 0, 200],
        [0.9, 1, 0.9],
        Extrapolate.CLAMP
      );
      const scaleY = interpolate(
        translateY.value,
        [-200, 0, 200],
        [0.9, 1, 0.9],
        Extrapolate.CLAMP
      );

      scale.value = Math.min(scaleX, scaleY);
    })

    .onEnd(() => {
      if (Math.abs(translateY.value) > 40 || Math.abs(translateX.value) > 40) {
        runOnJS(onClose)();
      } else {
        translateX.value = withSpring(0, springConfig);
        translateY.value = withSpring(0, springConfig);
        scale.value = withSpring(1, springConfig);
      }
    });

  const screenAnimatedStyles = useAnimatedStyle(() => {
    return {
      borderRadius: interpolate(
        scale.value,
        [1, 0.95],
        [0, 16],
        Extrapolate.CLAMP
      ),
      overflow: "visible",
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={onPan}>
      {children({
        translateX,
        translateY,
        scale,
        screenAnimatedStyles,
      })}
    </GestureDetector>
  );
}
