import React from "react";
import { StyleSheet, ViewProps, StyleProp, ViewStyle } from "react-native";

import { tw as tailwind } from "../tailwind";
import { TW } from "../tailwind/types";
import { View } from "../view";

export interface DividerProps extends ViewProps {
  /**  Applies style to the divider. */
  style?: StyleProp<ViewStyle>;

  /**  Tailwind style to the divider. */
  tw?: TW;

  /**  Apply orientation to the divider. */
  orientation?: "horizontal" | "vertical";

  /**  divider horizontal width to the divider, not support vertical mode  */
  width?: number;

  /**  divider vertical height to the divider, not support horizontal mode */
  height?: number;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  style,
  tw,
  width = "100%",
  height = "auto",
  ...rest
}) => (
  <View
    style={StyleSheet.flatten([
      tailwind.style("bg-gray-200 dark:bg-gray-800"),
      orientation === "horizontal"
        ? { width, height: StyleSheet.hairlineWidth }
        : { width: StyleSheet.hairlineWidth, height },
      tailwind.style(tw),
      style,
    ])}
    {...rest}
  />
);

Divider.displayName = "Divider";
