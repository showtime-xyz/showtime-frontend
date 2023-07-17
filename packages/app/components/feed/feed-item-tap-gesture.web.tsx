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

import { Play } from "@showtime-xyz/universal.icon";

import { useMuted } from "app/providers/mute-provider";

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
  const [muted, setMuted] = useMuted();

  const playAnimation = useSharedValue(0);

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

    if (curVideo.muted || muted) {
      curVideo.muted = false;
      setMuted(false);
      return;
    }

    if (!curVideo.paused) {
      curVideo.pause();
      playAnimation.value = withSequence(
        withSpring(1),
        withDelay(2000, withSpring(0))
      );
    } else {
      curVideo.play();
      playAnimation.value = withSequence(
        withSpring(1),
        withDelay(200, withSpring(0))
      );
    }
  }, [isVideo, videoRef, muted, setMuted, playAnimation]);

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

  const gesture = useMemo(
    () => Gesture.Exclusive(singleTapHandle),
    [singleTapHandle]
  );

  return (
    <>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      {isVideo ? (
        <>
          <Animated.View
            style={[heartContainerStyle, playStyle, sizeStyle]}
            pointerEvents="none"
          >
            <Play width={100} height={100} color="#fff" />
          </Animated.View>
        </>
      ) : null}
    </>
  );
};
