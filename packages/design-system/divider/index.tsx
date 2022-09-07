import React from "react";
import { StyleSheet, ViewProps, StyleProp, ViewStyle } from "react-native";

import type { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

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
    style={[
      orientation === "horizontal"
        ? { width, height: StyleSheet.hairlineWidth }
        : { width: StyleSheet.hairlineWidth, height },
      style,
    ]}
    tw={[
      Array.isArray(tw) ? tw.join(" ") : tw ?? "",
      "bg-gray-200 dark:bg-gray-800",
    ]}
    {...rest}
  />
);

Divider.displayName = "Divider";
