import { useCallback } from "react";
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

import { HeartFilled } from "@showtime-xyz/universal.icon";

import { useLike } from "app/context/like-context";

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

type FeedItemTapGestureProps = {
  children: JSX.Element;
  toggleHeader?: () => void;
  showHeader?: () => void;
};
export const FeedItemTapGesture = ({
  children,
  toggleHeader,
  showHeader,
}: FeedItemTapGestureProps) => {
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
    showHeader?.();
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

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .maxDistance(9999)
    .onStart(() => {
      ("worklet");
      if (toggleHeader) {
        runOnJS(toggleHeader)();
      }
    })
    .onEnd(() => {
      if (toggleHeader) {
        runOnJS(toggleHeader)();
      }
    });
  const gesture = Gesture.Race(
    longPressGesture,
    Gesture.Exclusive(doubleTapHandle)
  );

  return (
    <>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      <Animated.View
        style={[heartContainerStyle, heartStyle]}
        pointerEvents="none"
      >
        <HeartFilled width={90} height={90} color="#fff" />
      </Animated.View>
    </>
  );
};
