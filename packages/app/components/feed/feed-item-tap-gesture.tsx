import React, { useCallback, useRef } from "react";

import { TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
} from "react-native-reanimated";

import { useLike } from "app/context/like-context";

import { HeartFilled } from "design-system/icon";
import { tw } from "design-system/tailwind";

const heartContainerStyle = {
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
} as const;

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
  const doubleTapRef = useRef();

  const heartAnimation = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => {
    return {
      opacity: heartAnimation.value,
      transform: [{ scale: heartAnimation.value }],
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,

      elevation: 9,
    };
  });

  return (
    <>
      <TapGestureHandler waitFor={doubleTapRef} onActivated={toggleHeader}>
        <TapGestureHandler
          ref={doubleTapRef}
          numberOfTaps={2}
          onActivated={useCallback(() => {
            heartAnimation.value = withSequence(
              withSpring(1),
              withDelay(200, withSpring(0))
            );

            like();
            showHeader();
          }, [like, showHeader])}
        >
          {children}
        </TapGestureHandler>
      </TapGestureHandler>

      <Animated.View
        style={[heartContainerStyle, heartStyle]}
        pointerEvents="none"
      >
        <HeartFilled width={90} height={90} color={tw.color("white")} />
      </Animated.View>
    </>
  );
};
