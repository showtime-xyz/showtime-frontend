import React, { useCallback } from "react";
import { ViewStyle } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

import { tw } from "@showtime-xyz/universal.tailwind";

import { useLike } from "app/context/like-context";

import { HeartFilled } from "design-system/icon";

const heartContainerStyle: ViewStyle = {
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.32,
  shadowRadius: 5.46,
  elevation: 9,
};

export const FeedItemTapGesture = ({
  children,
  toggleHeader,
  showHeader,
}: {
  children: any;
  toggleHeader: any;
  showHeader: any;
}) => {
  const { like } = useLike();

  const heartAnimation = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => {
    return {
      opacity: heartAnimation.value,
      transform: [{ scale: heartAnimation.value }],
    };
  });

  const doubleTapHandleOnJS = useCallback(() => {
    like();
    showHeader();
  }, [like, showHeader]);

  const doubleTapHandle = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      heartAnimation.value = withSequence(
        withSpring(1),
        withDelay(200, withSpring(0))
      );
      runOnJS(doubleTapHandleOnJS)();
    });

  const singleTapHandler = Gesture.Tap().onEnd(() => {
    runOnJS(toggleHeader)();
  });
  const gesture = Gesture.Exclusive(doubleTapHandle, singleTapHandler);

  return (
    <>
      {/* @ts-ignore */}
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      <Animated.View
        style={[heartContainerStyle, heartStyle]}
        pointerEvents="none"
      >
        <HeartFilled width={90} height={90} color={tw.color("white")} />
      </Animated.View>
    </>
  );
};
