import { Easing } from "react-native";

import { View as MotiView } from "moti";

import { getSpinnerSize, SpinnerView, SpinnerProps } from "./spinner-view";

export const Spinner = ({ size, duration = 750, ...rest }: SpinnerProps) => {
  return (
    <MotiView
      from={{ rotate: "0deg" }}
      animate={{ rotate: "360deg" }}
      transition={{
        type: "timing",
        loop: true,
        repeatReverse: false,
        easing: Easing.linear,
        duration,
      }}
      style={{
        height: getSpinnerSize(size),
        width: getSpinnerSize(size),
      }}
      accessibilityRole="progressbar"
    >
      <SpinnerView size={size} {...rest} />
    </MotiView>
  );
};
