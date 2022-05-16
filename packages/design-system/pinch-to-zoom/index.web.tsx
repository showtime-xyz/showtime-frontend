import React from "react";
import type { ViewProps } from "react-native";

import Animated from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
  minimumZoomScale?: number;
  maximumZoomScale?: number;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  disabled?: boolean;
} & ViewProps;

export function PinchToZoom(props: Props) {
  return <Animated.View {...props} />;
}
