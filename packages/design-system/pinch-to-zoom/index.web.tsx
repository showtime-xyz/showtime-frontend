import React from "react";

import { View, ViewProps } from "@showtime-xyz/universal.view";

type Props = {
  children: React.ReactNode;
  minimumZoomScale?: number;
  maximumZoomScale?: number;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  disabled?: boolean;
} & ViewProps;

export function PinchToZoom(props: Props) {
  return <View {...props} />;
}
