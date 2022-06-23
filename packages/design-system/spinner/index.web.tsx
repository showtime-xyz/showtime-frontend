import { useEffect, useRef, useCallback, useMemo } from "react";
import { Animated, Easing } from "react-native";

import { getSpinnerSize, SpinnerView, SpinnerProps } from "./spinner-view";

export const Spinner = ({ size, duration = 750, ...rest }: SpinnerProps) => {
  const transition = useRef(new Animated.Value(0)).current;

  const startAnimation = useCallback(() => {
    Animated.timing(transition, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      transition.setValue(0);
      startAnimation();
    });
  }, [duration, transition]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const animatedStyle = useMemo(
    () => ({
      height: getSpinnerSize(size),
      width: getSpinnerSize(size),
      transform: [
        {
          rotate: transition.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
          }),
        },
      ],
    }),
    [size, transition]
  );

  return (
    <Animated.View style={animatedStyle} accessibilityRole="progressbar">
      <SpinnerView size={size} {...rest} />
    </Animated.View>
  );
};
