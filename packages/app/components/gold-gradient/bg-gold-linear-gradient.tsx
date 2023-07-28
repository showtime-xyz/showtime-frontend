import { StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const linearProps = {
  start: { x: 6, y: 1.9 },
  end: { x: 0, y: 1 },
  colors: [
    "#F5E794",
    "#F5E794",
    "#FED749",
    "#F6C33D",
    "#F6C33D",
    "#FED749",
    "#FDC93F",
    "#FED749",
    "#FDC93F",
    "#F6C33D",
    "#FBC73F",
    "#FBC73F",
    "#F4CE5E",
    "#F6C33D",
    "#F6C33D",
    "#FFD480",
    "#FBC73F",
    "#F5E794",
  ],
};

export const BgGoldLinearGradient = () => {
  return (
    <LinearGradient
      style={[StyleSheet.absoluteFill]}
      pointerEvents="none"
      {...linearProps}
    />
  );
};
