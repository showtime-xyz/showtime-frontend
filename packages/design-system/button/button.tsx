import { Children, cloneElement, useMemo } from "react";

import { LinearGradient } from "expo-linear-gradient";

import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

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
  isDark,
  ...props
}: BaseButtonProps) {
  const containerTW = useMemo(
    () =>
      [
        CONTAINER_TW,
        CONTAINER_HEIGHT_TW[size],
        iconOnly ? CONTAINER_ICON_PADDING_TW[size] : CONTAINER_PADDING_TW[size],
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
      const childTypeName = (child?.type?.name as string) ?? "";
      // We only want to pass the icon prop to the SvgIcon component.
      const svgIconProps =
        childTypeName.includes("Svg") || iconOnly
          ? {
              ...ICON_SIZE_TW[size],
              color:
                typeof iconColor === "string"
                  ? iconColor
                  : iconColor[isDark ? 1 : 0],
            }
          : {};
      if (child) {
        return cloneElement(child, {
          tw: [
            ...labelTW,
            Array.isArray(child?.props?.tw)
              ? child?.props?.tw.join(" ")
              : child?.props?.tw,
          ],
          style: labelStyle,
          ...svgIconProps,
          ...child?.props,
        });
      }
    });
  }, [children, iconOnly, size, iconColor, isDark, labelTW, labelStyle]);

  return (
    <PressableHover
      {...props}
      tw={[
        containerTW,
        backgroundColors ? backgroundColors["default"][isDark ? 1 : 0] : "",
      ]}
    >
      {renderChildren}
    </PressableHover>
  );
}

export function GradientButton({
  size = "small",
  tw = "",
  labelTW = "",
  iconOnly = false,
  iconColor = ["white", "black"],
  children,
  isDark,
  style,
  ...props
}: BaseButtonProps) {
  const containerTW = useMemo(
    () =>
      [
        CONTAINER_TW,
        CONTAINER_HEIGHT_TW[size],
        iconOnly ? CONTAINER_ICON_PADDING_TW[size] : CONTAINER_PADDING_TW[size],
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
          >
            {child}
          </Text>
        );
      }
      if (child) {
        return cloneElement(child, {
          tw: [
            ...labelTW,
            Array.isArray(child?.props?.tw)
              ? child?.props?.tw.join(" ")
              : child?.props?.tw,
          ],
          color:
            typeof iconColor === "string"
              ? iconColor
              : iconColor[isDark ? 1 : 0],
          ...ICON_SIZE_TW[size],
          ...child?.props,
        });
      }
    });
  }, [size, iconColor, labelTW, children, isDark]);

  return (
    <View tw={[containerTW, "overflow-hidden"]} style={style as any}>
      {props.gradientProps ? (
        <LinearGradient
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          {...props.gradientProps}
        />
      ) : null}
      <PressableHover {...props}>{renderChildren}</PressableHover>
    </View>
  );
}
