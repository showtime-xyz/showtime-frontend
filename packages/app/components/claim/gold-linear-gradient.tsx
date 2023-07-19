import { StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const prop = {
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
export const GoldLinearGradient = () => {
  return (
    <LinearGradient
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: 999,
        },
      ]}
      {...prop}
    />
  );
};
