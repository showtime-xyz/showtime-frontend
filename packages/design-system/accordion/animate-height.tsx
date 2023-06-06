import { StyleSheet, StyleProp, ViewStyle } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

export type AnimateHeightProps = {
  children?: React.ReactNode;
  /**
   * If `true`, the height will automatically animate to 0. Default: `false`.
   */
  hide?: boolean;
  onHeightDidAnimate?: (height: number) => void;
  initialHeight?: number;
  style?: StyleProp<ViewStyle>;
  extraHeight?: number;
};
const transition = { duration: 200 } as const;

export function AnimateHeight({
  children,
  hide = false,
  style,
  onHeightDidAnimate,
  initialHeight = 0,
  extraHeight = 0,
}: AnimateHeightProps) {
  const measuredHeight = useSharedValue(initialHeight);
  const childStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(!measuredHeight.value || hide ? 0 : 1, transition),
    }),
    [hide, measuredHeight]
  );

  const containerStyle = useAnimatedStyle(() => {
    return {
      willChange: "transform, scroll-position, contents", // make it hardware accelerated on web
      height: withTiming(
        hide ? 0 : measuredHeight.value + extraHeight,
        transition,
        () => {
          if (onHeightDidAnimate) {
            runOnJS(onHeightDidAnimate)(measuredHeight.value + extraHeight);
          }
        }
      ),
    };
  }, [hide, measuredHeight, extraHeight]);

  return (
    <Animated.View style={[styles.hidden, style, containerStyle]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.autoBottom, childStyle]}
        onLayout={({ nativeEvent }) => {
          measuredHeight.value = Math.ceil(nativeEvent.layout.height);
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  autoBottom: {
    bottom: "auto",
  },
  hidden: {
    overflow: "hidden",
  },
});
