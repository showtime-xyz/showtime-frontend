import { Children, cloneElement, useMemo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
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
  ...props
}: BaseButtonProps) {
  const isDarkMode = useIsDarkMode();

  const containerTW = useMemo(
    () =>
      [
        CONTAINER_TW,
        CONTAINER_HEIGHT_TW[size],
        CONTAINER_PADDING_TW[size],
        iconOnly ? CONTAINER_ICON_PADDING_TW[size] : "",
        Array.isArray(tw) ? tw.join(" ") : tw,
      ].join(" "),
    [tw, size, iconOnly]
  );

  const renderChildren = useMemo(() => {
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
        tw: [
          ...labelTW,
          Array.isArray(child?.props?.tw)
            ? child?.props?.tw.join(" ")
            : child?.props?.tw,
        ],
        style: labelStyle,
        color:
          typeof iconColor === "string"
            ? iconColor
            : iconColor[isDarkMode ? 1 : 0],
        ...ICON_SIZE_TW[size],
        ...child?.props,
      });
    });
  }, [size, iconColor, labelTW, children, isDarkMode, labelStyle]);

  return (
    <PressableHover
      {...props}
      tw={[containerTW, backgroundColors ? backgroundColors["default"] : ""]}
    >
      {renderChildren}
    </PressableHover>
  );
}
