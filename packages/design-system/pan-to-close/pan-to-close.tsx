import { FC } from "react";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  WithSpringConfig,
  runOnJS,
} from "react-native-reanimated";

export const SPRING_CONFIG: WithSpringConfig = {
  mass: 0.3,
};
const DRAG_TOSS = 0.4;
const CLOSE_DISTANCE = 60;
export type PanToCloseProps = {
  children: JSX.Element;
  panCloseDirection?: "up" | "down" | null;
  onClose: () => void;
  disable?: boolean;
  closeDuration?: number;
};
export const PanToClose: FC<PanToCloseProps> = ({
  children,
  panCloseDirection,
  onClose: propOnClose,
  disable,
  closeDuration = 300,
}) => {
  const transY = useSharedValue(0);
  transY.value = 0;
  const panIsVertical = useSharedValue(false);
  const isSwipeDownToClose = panCloseDirection === "down";
  const animatedStyle = useAnimatedStyle(() => {
    const distance = isSwipeDownToClose ? transY.value : -transY.value;
    const opacity = interpolate(distance, [0, CLOSE_DISTANCE * 1.5], [1, 0]);

    return {
      opacity: opacity,
      transform: [
        {
          translateY: transY.value,
        },
      ],
    };
  });
  const onClose = () => {
    propOnClose();
    setTimeout(() => {
      transY.value = 0;
    }, closeDuration);
  };
  const snapToPoint = (y: number) => {
    "worklet";
    transY.value = withSpring(y, SPRING_CONFIG, () => {
      if (y !== 0) {
        runOnJS(onClose)();
      }
    });
  };
  const panGesture = Gesture.Pan()
    .onStart(({ velocityY, velocityX }) => {
      panIsVertical.value = Math.abs(velocityY) >= Math.abs(velocityX);
    })
    .onUpdate(({ translationY }) => {
      if (!panIsVertical.value) return;
      if (isSwipeDownToClose) {
        transY.value = translationY > 0 ? translationY : translationY * 0.2;
      } else {
        transY.value = translationY > 0 ? translationY * 0.2 : translationY;
      }
    })
    .onEnd(({ velocityY, translationY }) => {
      if (!panIsVertical.value) return;
      const endOffsetY = transY.value + velocityY * DRAG_TOSS;
      const isSwipeDown = translationY > 0;
      const isPanEnough = Math.abs(endOffsetY) > CLOSE_DISTANCE;
      if (isSwipeDownToClose) {
        snapToPoint(!isSwipeDown || !isPanEnough ? 0 : endOffsetY);
      } else {
        snapToPoint(isSwipeDown || !isPanEnough ? 0 : endOffsetY);
      }
    });
  if (!panCloseDirection) return null;
  if (disable) return children;
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
