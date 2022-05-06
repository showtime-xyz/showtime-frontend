import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Placement } from "./getPlacement";

export type TooltipProps = {
  text?: string;
  delay?: number;
  placement?: Placement;
  open?: boolean;
  offset?: number;
  children: React.ReactNode;
  tw?: string;
  style?: StyleProp<ViewStyle>;
  textTw?: string;
  customContent?: JSX.Element;
  contentStyle?: StyleProp<ViewStyle>;
};
