import { Children, cloneElement, useMemo } from "react";

import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { Pressable } from "design-system/pressable-scale";
import { tw as tailwind } from "design-system/tailwind";
import { Text } from "design-system/text";

import { useIsDarkMode } from "../hooks";
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
  const animatedPressed = useSharedValue(false);
  const pressed = useSharedValue(false);
  const scaleTo = 0.95;
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
      backgroundColor: backgroundColors
        ? backgroundColors[animatedPressed.value ? "pressed" : "default"][
            isDarkMode ? 1 : 0
          ]
        : "transparent",
      transform: [
        { scale: pressed.value ? withTiming(scaleTo) : withTiming(1) },
      ],
    }),
    [backgroundColors, animatedPressed, isDarkMode]
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

  if (asChild) {
    return (
      <Animated.View
        style={useMemo(
          () =>
            backgroundColors
              ? [containerAnimatedStyle, tailwind.style(containerStyle)]
              : tailwind.style(containerStyle),
          [backgroundColors, containerAnimatedStyle, containerStyle]
        )}
      >
        {renderChildren}
      </Animated.View>
    );
  }

  return (
    <Pressable
      {...props}
      // TODO: remove when https://github.com/software-mansion/react-native-reanimated/issues/3209 is fixed
      onPressIn={() => (pressed.value = true)}
      onPressOut={() => (pressed.value = false)}
      tw={containerStyle}
      style={backgroundColors ? containerAnimatedStyle : undefined}
      pressedValue={animatedPressed}
      children={renderChildren}
    />
  );
  //#endregion
}
