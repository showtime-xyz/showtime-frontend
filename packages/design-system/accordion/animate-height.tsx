import React from "react";
import { StyleSheet, Platform, View } from "react-native";

import { View as MotiView, useDynamicAnimation } from "moti";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";

type Props = {
  children?: React.ReactNode;
  /**
   * If `true`, the height will automatically animate to 0. Default: `false`.
   */
  hide?: boolean;
  /**
   * Custom transition for the outer `moti` View, which animates the `height`.
   *
   * See the [moti docs](https://moti.fyi/animations#customize-your-animation) for more info.
   *
   * Defaults to a `type: 'timing'` animation with a `delay` of 200. You can use this to customize that.
   */
  onHeightDidAnimate?: (height: number) => void;
  /**
   * Defines where the expanded view will be anchored.
   *
   * Default: `top`
   *
   * This prop is untested, use with caution
   */
  enterFrom?: "bottom" | "top";
  initialHeight?: number;
} & Omit<React.ComponentProps<typeof MotiView>, "state">;

export function AnimateHeight({
  children,
  hide = false,
  style,
  delay = Platform.select({ web: 250, default: 0 }),
  transition = { type: "timing", delay },
  enterFrom = "top",
  onHeightDidAnimate,
  initialHeight = 0,
  ...motiViewProps
}: Props) {
  const measuredHeight = useSharedValue(initialHeight);

  const state = useDynamicAnimation(() => {
    return {
      height: initialHeight,
      opacity: !initialHeight || hide ? 0 : 1,
    };
  });
  if ("state" in motiViewProps) {
    console.warn("[AnimateHeight] state prop not supported");
  }
  useDerivedValue(() => {
    let height = Math.ceil(measuredHeight.value);
    if (hide) {
      height = 0;
    }

    state.animateTo({
      height,
      opacity: !height || hide ? 0 : 1,
    });
  }, [hide, measuredHeight]);
  return (
    <MotiView
      {...motiViewProps}
      state={state}
      transition={transition}
      onDidAnimate={
        onHeightDidAnimate &&
        ((key, finished, _, { attemptedValue }) =>
          key == "height" && onHeightDidAnimate(attemptedValue as number))
      }
      style={[styles.hidden, style]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.autoBottom,
          enterFrom === "top" ? styles.autoBottom : styles.autoTop,
        ]}
        onLayout={({ nativeEvent }) => {
          measuredHeight.value = nativeEvent.layout.height;
        }}
      >
        {children}
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  autoBottom: {
    bottom: "auto",
  },
  autoTop: {
    top: "auto",
  },
  hidden: {
    overflow: "hidden",
  },
  visible: {
    overflow: "visible",
  },
});
