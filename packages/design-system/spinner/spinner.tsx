import { useEffect } from "react";

import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
} from "react-native-reanimated";

import { getSpinnerSize, SpinnerView, SpinnerProps } from "./spinner-view";

export const Spinner = ({ size, duration = 750, ...rest }: SpinnerProps) => {
  const transition = useSharedValue(0);

  useEffect(() => {
    transition.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: transition.value + "deg" }],
    };
  }, []);

  return (
    <Animated.View
      style={[
        { height: getSpinnerSize(size), width: getSpinnerSize(size) },
        animatedStyle,
      ]}
      accessibilityRole="progressbar"
    >
      <SpinnerView size={size} {...rest} />
    </Animated.View>
  );
};
