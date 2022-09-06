import { Children, cloneElement, useMemo } from "react";
import { ViewStyle } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";

import {
  CONTAINER_HEIGHT_TW,
  CONTAINER_ICON_PADDING_TW,
  CONTAINER_PADDING_TW,
  CONTAINER_TW,
  ICON_SIZE_TW,
  LABEL_SIZE_TW,
  LABEL_WEIGHT_TW,
} from "./constants";
import type { BaseButtonProps } from "./types";

export function Button({
  size = "small",
  tw = "",
  labelTW = "",
  labelStyle,
  backgroundColors,
  iconOnly = false,
  iconColor = ["white", "black"],
  children,
  disabled,
  style: propStyle,
  ...props
}: BaseButtonProps) {
  const isDarkMode = useIsDarkMode();

  const containerStyle = useMemo<any>(
    () => [
      CONTAINER_TW,
      CONTAINER_HEIGHT_TW[size],
      CONTAINER_PADDING_TW[size],
      iconOnly ? CONTAINER_ICON_PADDING_TW[size] : "",
      Array.isArray(tw) ? tw.join(" ") : tw,
    ],
    [tw, size, iconOnly]
  );

  const containerAnimatedStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: backgroundColors
        ? backgroundColors["default"][isDarkMode ? 1 : 0]
        : "transparent",
    }),
    [backgroundColors, isDarkMode]
  );

  const renderChildren = useMemo(() => {
    const iconSize = ICON_SIZE_TW[size];

    return Children.map(children, (child: any) => {
      if (typeof child === "string") {
        return (
          <Text
            tw={[
              LABEL_SIZE_TW[size],
              LABEL_WEIGHT_TW[size],
              Array.isArray(labelTW) ? labelTW.join(" ") : labelTW,
            ]}
            style={labelStyle}
          >
            {child}
          </Text>
        );
      }

      return cloneElement(child, {
        color:
          typeof iconColor === "string"
            ? iconColor
            : iconColor[isDarkMode ? 1 : 0],
        ...iconSize,
        ...child?.props,
        tw: [
          ...labelTW,
          Array.isArray(child?.props?.tw)
            ? child?.props?.tw.join(" ")
            : child?.props?.tw,
        ],
        style: labelStyle,
      });
    });
  }, [size, iconColor, labelTW, children, isDarkMode, labelStyle]);

  return (
    <Pressable
      {...props}
      tw={containerStyle}
      disabled={disabled}
      style={[backgroundColors ? containerAnimatedStyle : undefined, propStyle]}
    >
      {renderChildren}
    </Pressable>
  );
}
