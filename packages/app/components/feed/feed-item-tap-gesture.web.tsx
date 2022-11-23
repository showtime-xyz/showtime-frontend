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
};

type FeedItemTapGestureProps = {
  children: JSX.Element;
  toggleHeader?: () => void;
  showHeader?: () => void;
};
export const FeedItemTapGesture = ({ children }: FeedItemTapGestureProps) => {
  const { like } = useLike();

  const heartAnimation = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => {
    return {
      opacity: heartAnimation.value,
      transform: [{ scale: heartAnimation.value }],
    };
  });

  const doubleTapHandle = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      heartAnimation.value = withSequence(
        withSpring(1),
        withDelay(200, withSpring(0))
      );
      runOnJS(like)();
    });

  return (
    <>
      <GestureDetector gesture={doubleTapHandle}>{children}</GestureDetector>
      <Animated.View
        style={[heartContainerStyle, heartStyle]}
        pointerEvents="none"
      >
        <HeartFilled width={90} height={90} color="#fff" />
      </Animated.View>
    </>
  );
};
