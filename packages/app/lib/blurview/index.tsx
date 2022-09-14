import React from "react";
import { StyleSheet } from "react-native";

import {
  BlurView as RNBlurView,
  BlurViewProps as RNBlurViewProps,
} from "@react-native-community/blur";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { View } from "@showtime-xyz/universal.view";

export type BlurViewProps = RNBlurViewProps & {
  tw?: string;
};
export const BlurView = ({ tw = "", ...rest }: BlurViewProps) => {
  const isDark = useIsDarkMode();
  return (
    <RNBlurView
      style={StyleSheet.absoluteFill}
      blurType={isDark ? "dark" : "light"}
      blurAmount={95}
      {...rest}
    >
      <View
        tw={["ios:opacity-20 android:opacity-80 bg-white dark:bg-black", tw]}
        style={StyleSheet.absoluteFill}
      />
    </RNBlurView>
  );
};
