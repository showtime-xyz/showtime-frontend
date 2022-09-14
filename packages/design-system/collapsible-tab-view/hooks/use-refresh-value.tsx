import Animated, {
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";

export const useRefreshDerivedValue = (
  translateYValue: Animated.SharedValue<number>,
  {
    refreshHeight,
    overflowPull,
    animatedValue,
    pullExtendedCoefficient,
  }: {
    refreshHeight: number;
    overflowPull: number;
    animatedValue: Animated.SharedValue<number>;
    pullExtendedCoefficient: number;
  }
) => {
  return useDerivedValue(() => {
    translateYValue.value = interpolate(
      animatedValue.value,
      [0, refreshHeight + overflowPull, refreshHeight + overflowPull + 1],
      [
        0,
        refreshHeight + overflowPull,
        refreshHeight + overflowPull + pullExtendedCoefficient,
      ]
    );
  });
};
