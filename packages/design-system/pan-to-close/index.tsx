import { FC } from "react";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export const SPRING_CONFIG = {
  mass: 0.5,
  overshootClamping: true,
};

export type PanToCloseProps = {
  children: JSX.Element;
  panCloseDirection: "top" | "bottom";
  onClose: () => void;
};
export const PanToClose: FC<PanToCloseProps> = ({
  children,
  panCloseDirection = "top",
  onClose,
}) => {
  const transY = useSharedValue(0);
  const panIsVertical = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: transY.value,
        },
      ],
    };
  });
  const panGestrue = Gesture.Pan()
    .onStart(({ velocityY, velocityX }) => {
      panIsVertical.value = Math.abs(velocityY) >= Math.abs(velocityX);
    })
    .onUpdate(({ translationY, velocityY, ...rest }) => {
      if (!panIsVertical.value) return;
      if (panCloseDirection === "bottom") {
        transY.value = translationY > 0 ? translationY : translationY * 0.2;
      } else {
        transY.value = translationY > 0 ? translationY * 0.2 : translationY;
      }
    })
    .onEnd(({ velocityY, translationY }, success) => {
      if (!panIsVertical.value) return;
      transY.value = withSpring(0, SPRING_CONFIG);
    });
  return (
    // @ts-ignore
    <GestureDetector gesture={panGestrue}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
