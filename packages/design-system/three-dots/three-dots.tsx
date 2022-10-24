import { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";

import { DotAnimationProps } from "./type";

export const ThreeDotsAnimation = ({ style, ...rest }: DotAnimationProps) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-end",
        },
        style,
      ]}
    >
      {new Array(3).fill(0).map((_, index) => (
        <Dot key={index.toString()} {...rest} index={index} />
      ))}
    </View>
  );
};

const Dot = ({
  color = "#000",
  dotStyle,
  index,
}: Pick<DotAnimationProps, "color" | "dotStyle"> & {
  index: number;
}) => {
  const opacity = useSharedValue(0);
  const delayMS = 200 * (index + 1);
  useEffect(() => {
    opacity.value = withDelay(
      delayMS,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, [delayMS, opacity]);
  const dotAnimation = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color }, dotStyle, dotAnimation]}
    />
  );
};
const styles = StyleSheet.create({
  dot: {
    width: 2,
    height: 2,
    borderRadius: 2,
    marginLeft: 2,
  },
});
