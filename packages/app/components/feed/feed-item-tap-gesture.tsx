import { useCallback, MutableRefObject, useMemo } from "react";
import { ViewStyle } from "react-native";

import { Video } from "expo-av";
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
import { colors } from "@showtime-xyz/universal.tailwind";

import { useLike } from "app/context/like-context";

const ICON_SIZE = 90;
const heartContainerStyle: ViewStyle = {
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
};
const shadowStyle: ViewStyle = {
  backgroundColor: "rgba(0,0,0,0)",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 13,
};

type FeedItemTapGestureProps = {
  children: JSX.Element;
  toggleHeader?: () => void;
  showHeader?: () => void;
  videoRef?: MutableRefObject<Video | null>;
  mediaOffset?: number;
  sizeStyle?: {
    width?: number;
    height?: number;
  };
  isVideo?: boolean;
};
export const FeedItemTapGesture = ({
  children,
  toggleHeader,
  showHeader,
  videoRef,
  mediaOffset,
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
  });

  const playStyle = useAnimatedStyle(() => {
    return {
      opacity: playAnimation.value,
      transform: [{ scale: playAnimation.value }],
    };
  });

  const doubleTapHandleOnJS = useCallback(() => {
    like();
    showHeader?.();
  }, [like, showHeader]);

  const toggleVideoPlayback = useCallback(async () => {
    if (!isVideo) return;
    const status = await videoRef?.current?.getStatusAsync();
    if (status && status.isLoaded && status?.isPlaying) {
      playAnimation.value = withSequence(
        withSpring(1),
        withDelay(1500, withSpring(0))
      );
      videoRef?.current?.pauseAsync().catch(() => {});
    } else {
      playAnimation.value = withSequence(
        withSpring(1),
        withDelay(200, withSpring(0))
      );
      videoRef?.current?.playAsync().catch(() => {});
    }
  }, [videoRef, playAnimation, isVideo]);

  const singleTapHandle = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(1)
        .onEnd(() => {
          runOnJS(toggleVideoPlayback)();
        }),

    [toggleVideoPlayback]
  );

  const doubleTapHandle = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
          playAnimation.value = withSequence(withSpring(0));
          heartAnimation.value = withSequence(
            withSpring(1),
            withDelay(200, withSpring(0))
          );
          runOnJS(doubleTapHandleOnJS)();
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doubleTapHandleOnJS]
  );

  const longPressGesture = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(300)
        .maxDistance(9999)
        .shouldCancelWhenOutside(true)
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
        }),
    [toggleHeader]
  );

  const gesture = useMemo(
    () => Gesture.Exclusive(doubleTapHandle, longPressGesture, singleTapHandle),
    [doubleTapHandle, longPressGesture, singleTapHandle]
  );

  const topOffset = useMemo(
    () => ({
      top: mediaOffset ?? -ICON_SIZE,
    }),
    [mediaOffset]
  );

  return (
    <>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      <Animated.View
        style={[heartContainerStyle, heartStyle, topOffset]}
        pointerEvents="none"
      >
        <HeartFilled
          style={shadowStyle}
          width={ICON_SIZE}
          height={ICON_SIZE}
          color={colors.rose[500]}
        />
      </Animated.View>
      {isVideo ? (
        <>
          <Animated.View
            style={[heartContainerStyle, playStyle, topOffset]}
            pointerEvents="none"
          >
            <Play width={110} height={110} color="#fff" />
          </Animated.View>
        </>
      ) : null}
    </>
  );
};
