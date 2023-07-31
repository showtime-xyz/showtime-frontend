import { memo } from "react";
import { StyleSheet } from "react-native";

import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

const linearProps = {
  start: { x: 1.75, y: -1.79 },
  end: { x: 0.25, y: 1.1 },
  colors: [
    "#FFCB6C",
    "#FDD764",
    "#FFD24D",
    "#EDAF00",
    "#EDAF38",
    "#FDC93F",
    "#FFD480",
    "#FED749",
    "#FDC93F",
    "#F6C33D",
    "#F6C33D",
    "#F4CE5E",
    "#FBC73F",
    "#FFD480",
    "#F5E794",
    "#F5E794",
    "#F5E794",
  ],
};
type ButtonGoldLinearGradientProps = Omit<LinearGradientProps, "colors"> & {};
export const ButtonGoldLinearGradient = memo<ButtonGoldLinearGradientProps>(
  function ButtonGoldLinearGradient({ style, ...rest }) {
    return (
      <LinearGradient
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: 999,
            zIndex: -1,
          },
          style,
        ]}
        {...linearProps}
        {...rest}
      />
    );
  }
);
