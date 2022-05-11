import { StyleSheet } from "react-native";

import Animated, { useAnimatedProps } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  strokeWidth: number;
  progress: Readonly<Animated.SharedValue<number>>;
  showOverlay?: boolean;
  strokeColor?: string;
};

const CircularProgress = ({
  size,
  strokeWidth,
  progress,
  strokeColor = "rgba(255, 255, 255, 0.2)",
}: Props) => {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = r * 2 * Math.PI;
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * progress.value,
  }));

  return (
    <>
      <Svg
        width={size}
        height={size}
        style={styles.container}
        viewBox={`0 0 ${size} ${size}`}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          stroke="white"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    transform: [{ rotateZ: "270deg" }],
  },
});

export { CircularProgress };
