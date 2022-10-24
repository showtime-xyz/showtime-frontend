import type { StyleProp, ViewStyle } from "react-native";

export type DotAnimationProps = {
  style?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
  spacing?: number;
};
