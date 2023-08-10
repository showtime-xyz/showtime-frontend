import { memo } from "react";
import { StyleSheet } from "react-native";

// import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

const linearProps = {
  colors: ["#F5E794", "#FBC73F", "#FFD480", "#F1A819", "#E4973C", "#F4CE5E"],
  end: { x: 1.05, y: 0.07 },
  locations: [0.1, 0.4, 0.54, 0.9, 0.98, 1],
  start: { x: -0.05, y: 0.92 },
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
