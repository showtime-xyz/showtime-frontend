import { useCallback, useMemo } from "react";
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

import { HeartFilled, Play } from "@showtime-xyz/universal.icon";

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
  videoRef?: any;
  sizeStyle?: {
    width?: number;
    height?: number;
  };
  isVideo?: boolean;
};
export const FeedItemTapGesture = ({
  children,
  videoRef,
  sizeStyle,
  isVideo,
}: FeedItemTapGestureProps) => {
  const { like } = useLike();

  const heartAnimation = useSharedValue(0);
  const playAnimation = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => {
    return {
      opacity: heartAnimation.value,
      transform: [{ scale: heartAnimation.value }],
    };
  }, [heartAnimation]);

  const playStyle = useAnimatedStyle(() => {
    return {
      opacity: playAnimation.value,
      transform: [{ scale: playAnimation.value }],
    };
  }, [playAnimation]);

  const toggleVideoPlayback = useCallback(async () => {
    if (!isVideo) return;
    const curVideo = videoRef?.current?._nativeRef?.current?._video;
    if (!curVideo) return;

    if (curVideo.muted) {
      curVideo.muted = false;
      return;
    }

    if (!curVideo.paused) {
      curVideo.pause();
      playAnimation.value = withSequence(
        withSpring(1),
        withDelay(2500, withSpring(0))
      );
    } else {
      curVideo.play();
      playAnimation.value = withSequence(
        withSpring(1),
        withDelay(200, withSpring(0))
      );
    }
  }, [videoRef, playAnimation, isVideo]);

  const singleTapHandle = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(1)
        // needed for mouse drag on web
        .maxDistance(10)
        .shouldCancelWhenOutside(true)
        .onEnd(() => {
          runOnJS(toggleVideoPlayback)();
        }),

    [toggleVideoPlayback]
  );

  const doubleTapHandleOnJS = useCallback(() => {
    like();
  }, [like]);

  const doubleTapHandle = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
          playAnimation.value = withSequence(withSpring(0));
          heartAnimation.value = withSequence(
            withSpring(1),
            withDelay(300, withSpring(0))
          );
          runOnJS(doubleTapHandleOnJS)();
        }),
    [heartAnimation, doubleTapHandleOnJS, playAnimation]
  );

  const gesture = useMemo(
    () => Gesture.Race(Gesture.Exclusive(doubleTapHandle, singleTapHandle)),
    [doubleTapHandle, singleTapHandle]
  );

  return (
    <>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      <Animated.View
        style={[heartContainerStyle, heartStyle, sizeStyle]}
        pointerEvents="none"
      >
        <HeartFilled width={90} height={90} color="#fff" />
      </Animated.View>
      {isVideo ? (
        <>
          <Animated.View
            style={[heartContainerStyle, playStyle, sizeStyle]}
            pointerEvents="none"
          >
            <Play width={120} height={120} color="#fff" />
          </Animated.View>
        </>
      ) : null}
    </>
  );
};
