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

import { Play } from "@showtime-xyz/universal.icon";

const ICON_SIZE = 90;
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
  videoRef,
  mediaOffset,
  isVideo,
}: FeedItemTapGestureProps) => {
  const playAnimation = useSharedValue(0);

  const playStyle = useAnimatedStyle(() => {
    return {
      opacity: playAnimation.value,
      transform: [{ scale: playAnimation.value }],
    };
  });

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
    () => Gesture.Exclusive(longPressGesture, singleTapHandle),
    [longPressGesture, singleTapHandle]
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
