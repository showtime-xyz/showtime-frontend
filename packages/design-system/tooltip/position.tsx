import { ReactNode, RefObject, useState } from "react";
import { LayoutChangeEvent, Platform, View as NativeWiew } from "react-native";

import Animated, { useAnimatedStyle } from "react-native-reanimated";

import {
  usePlatformResize,
  useWebClientRect,
  useWebScroll,
} from "@showtime-xyz/universal.hooks";

import { Placement, getPosition, PlatformRect } from "./get-placement";

interface IPositionProps {
  triggerRef: RefObject<HTMLElement | NativeWiew | null>;
  triggerRect?: PlatformRect;
  children: ReactNode;
  placement?: Placement;
}

export const Position = ({
  triggerRef,
  placement = Placement.bottom,
  children,
  triggerRect: nativeTriggerRect,
}: IPositionProps) => {
  const [triggerRect, updateTriggerRect] = useWebClientRect(triggerRef);
  const [contentRect, setContentRect] = useState<PlatformRect>(null);
  usePlatformResize(updateTriggerRect);
  useWebScroll(triggerRef, updateTriggerRect);
  const positionStyle = useAnimatedStyle(() => {
    const position = getPosition(
      Platform.OS === "web" ? triggerRect : nativeTriggerRect!,
      contentRect,
      placement
    );
    return {
      transform: [{ translateX: position.left }, { translateY: position.top }],
    };
  });

  const onLayout = ({
    nativeEvent: {
      layout: { width, height, x, y },
    },
  }: LayoutChangeEvent) => {
    setContentRect({
      width,
      height,
      left: x,
      top: y,
    });
  };
  return (
    <Animated.View
      style={[
        {
          position: Platform.OS === "web" ? ("fixed" as any) : "absolute",
          zIndex: 999,
        },
        positionStyle,
      ]}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
};
