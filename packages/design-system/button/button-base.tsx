import { Children, cloneElement, useMemo } from "react";

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
  backgroundColors,
  iconOnly = false,
  iconColor = ["white", "black"],
  children,
  asChild,
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
  const containerAnimatedStyle = useMemo(
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
        return <Text tw={labelStyle}>{child}</Text>;
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
      });
    });
  }, [size, iconColor, labelStyle, children, isDarkMode]);

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
      style={backgroundColors ? containerAnimatedStyle : undefined}
    >
      {renderChildren}
    </PressableScale>
  );
  //#endregion
}
