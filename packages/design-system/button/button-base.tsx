import { Children, cloneElement, useMemo } from "react";
import { ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
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

export function BaseButton({
  size = "small",
  tw = "",
  labelTW = "",
  labelStyle: labelStyleProp,
  backgroundColors,
  iconOnly = false,
  iconColor = ["white", "black"],
  children,
  asChild,
  disabled,
  style: propStyle,
  ...props
}: BaseButtonProps) {
  //#region variables
  const isDarkMode = useIsDarkMode();
  //#endregion

  //#region styles
  const containerStyle = useMemo<any>(
    () => [
      CONTAINER_TW,
      CONTAINER_HEIGHT_TW[size],
      CONTAINER_PADDING_TW[size],
      iconOnly ? CONTAINER_ICON_PADDING_TW[size] : "",
      typeof tw === "string" ? tw : tw.join(" "),
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

  const labelStyle = useMemo(
    () => [
      LABEL_SIZE_TW[size],
      LABEL_WEIGHT_TW[size],
      typeof labelTW === "string" ? labelTW : labelTW.join(" "),
    ],
    [labelTW, size]
  );
  //#endregion

  //#region renderings
  const renderChildren = useMemo(() => {
    const iconSize = ICON_SIZE_TW[size];
    return Children.map(children, (child: any) => {
      if (typeof child === "string") {
        return (
          <Text tw={labelStyle} style={labelStyleProp}>
            {child}
          </Text>
        );
      }

      // @ts-ignore
      return cloneElement(child, {
        color:
          typeof iconColor === "string"
            ? iconColor
            : iconColor[isDarkMode ? 1 : 0],
        ...iconSize,
        ...child?.props,
        tw: [
          ...labelStyle,
          child?.props?.tw
            ? typeof child?.props?.tw === "string"
              ? child?.props?.tw
              : child?.props?.tw.join(" ")
            : "",
        ],
        style: labelStyleProp,
      });
    });
  }, [size, iconColor, labelStyle, children, isDarkMode, labelStyleProp]);

  const childStyles = useMemo(
    () =>
      backgroundColors
        ? [containerAnimatedStyle, tailwind.style(containerStyle)]
        : tailwind.style(containerStyle),
    [backgroundColors, containerAnimatedStyle, containerStyle]
  );

  if (asChild) {
    return <Animated.View style={childStyles}>{renderChildren}</Animated.View>;
  }

  return (
    <PressableScale
      {...props}
      tw={containerStyle}
      disabled={disabled}
      style={[backgroundColors ? containerAnimatedStyle : undefined, propStyle]}
    >
      {renderChildren}
    </PressableScale>
  );
  //#endregion
}
