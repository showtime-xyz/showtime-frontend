import React from "react";
import { StyleSheet } from "react-native";

import {
  BlurView as RNBlurView,
  BlurViewProps as RNBlurViewProps,
} from "@react-native-community/blur";

export type BlurViewProps = RNBlurViewProps & {
  tw?: string;
  children?: JSX.Element;
};
export const BlurView = ({ children, ...rest }: BlurViewProps) => {
  return (
    <RNBlurView
      style={StyleSheet.absoluteFillObject}
      blurAmount={100}
      {...rest}
    >
      {children}
    </RNBlurView>
  );
};
