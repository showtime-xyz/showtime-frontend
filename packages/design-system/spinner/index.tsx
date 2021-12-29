import { useEffect, useMemo } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useIsDarkMode } from "../hooks";
import { Platform, StyleSheet } from "react-native";

type SpinnerProps = {
  size?: number;
};

const duration = 750;
const defaultSize = 32;

export const Spinner = (props: SpinnerProps) => {
  const { size = defaultSize } = props;
  const transition = useSharedValue(0);

  const isDark = useIsDarkMode();

  useEffect(() => {
    transition.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: transition.value + "deg" }],
    };
  }, []);

  const animationStyle = useMemo(() => {
    return Platform.OS === "web"
      ? StyleSheet.create({
          animation: {
            //@ts-ignore
            animationDuration: duration + "ms",
            animationKeyframes: [
              {
                "0%": { transform: [{ rotate: "0deg" }] },
                "100%": { transform: [{ rotate: "360deg" }] },
              },
            ],
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          },
        }).animation
      : animatedStyle;
  }, [animatedStyle]);

  return (
    <Animated.View
      style={[{ height: size, width: size }, animationStyle]}
      accessibilityRole="progressbar"
    >
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          stroke={isDark ? "#3F3F46" : "#F4F4F5"}
        />
        <Circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          stroke="#8B5CF6"
          strokeDasharray={80}
          strokeDashoffset={56}
        />
      </Svg>
    </Animated.View>
  );
};
