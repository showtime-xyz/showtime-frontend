import React from "react";
import { StyleSheet } from "react-native";

import {
  BlurView as RNBlurView,
  BlurViewProps as RNBlurViewProps,
} from "@react-native-community/blur";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

export type BlurViewProps = RNBlurViewProps & {
  tw?: string;
  children?: JSX.Element;
};
export const BlurView = ({ children, ...rest }: BlurViewProps) => {
  const isDark = useIsDarkMode();

  return (
    <RNBlurView
      style={StyleSheet.absoluteFillObject}
      blurType={isDark ? "dark" : "light"}
      blurAmount={100}
      {...rest}
    >
      {children}
    </RNBlurView>
  );
};
