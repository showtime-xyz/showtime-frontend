import React, { useMemo } from "react";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useIsDarkMode } from "../hooks";
import { Pressable } from "design-system/pressable-scale";
import { Text } from "design-system/text";

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
  size,
  tw = "",
  labelTW = "",
  backgroundColors,
  iconOnly,
  iconColor = "black",
  children,
  ...props
}: BaseButtonProps) {
  //#region variables
  const isDarkMode = useIsDarkMode();
  const animatedPressed = useSharedValue(false);
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
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor:
        backgroundColors![animatedPressed.value ? "pressed" : "default"][
          isDarkMode ? 1 : 0
        ],
    }),
    [animatedPressed, isDarkMode]
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
    return React.Children.map(children, (child: any) => {
      if (typeof child === "string") {
        return <Text tw={labelStyle}>{child}</Text>;
      }

      // @ts-ignore
      return React.cloneElement(child, {
        color: iconColor,
        ...iconSize,
        ...child.props,
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
  }, [size, iconColor, labelStyle, children]);
  return (
    <Pressable
      {...props}
      tw={containerStyle}
      style={containerAnimatedStyle}
      pressedValue={animatedPressed}
      children={renderChildren}
    />
  );
  //#endregion
}
