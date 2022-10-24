import React from "react";
import { StyleSheet } from "react-native";

import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";

import {
  RefreshControlProps,
  RefreshTypeEnum,
} from "@showtime-xyz/universal.collapsible-tab-view";
import { SpinnerView } from "@showtime-xyz/universal.spinner";

export const RefreshControl = ({
  progress,
  refreshType,
}: RefreshControlProps) => {
  const animationValue = useSharedValue(0);
  const containerAnimationValue = useSharedValue(0);
  const isRefreshed = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: animationValue.value + "deg",
        },
      ],
    };
  }, [animationValue.value]);
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: containerAnimationValue.value + "deg",
        },
      ],
      opacity: progress.value,
    };
  }, [containerAnimationValue.value]);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (refreshType.value === RefreshTypeEnum.Cancel) {
        animationValue.value = value * 360;
      }
    },
    [progress.value, refreshType.value]
  );
  useAnimatedReaction(
    () => refreshType.value,
    (type) => {
      if (type === RefreshTypeEnum.Refreshing && !isRefreshed.value) {
        containerAnimationValue.value = withRepeat(
          withTiming(360, { duration: 400, easing: Easing.linear }),
          -1,
          false
        );
        isRefreshed.value = true;
      } else if (type === RefreshTypeEnum.Finish) {
        cancelAnimation(containerAnimationValue);
        containerAnimationValue.value = 0;
        animationValue.value = 0;
        isRefreshed.value = false;
      }
    },
    [refreshType.value, containerAnimationValue.value]
  );
  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <SpinnerView size="small" />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
