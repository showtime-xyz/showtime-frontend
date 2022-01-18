import React, { forwardRef, useMemo, FC } from "react";
import { Pressable } from "design-system/pressable-scale";
import { Text } from "design-system/text";

import type { BaseButtonProps } from "./types";
import {
  CONTAINER_HEIGHT_TW,
  CONTAINER_ICON_PADDING_TW,
  CONTAINER_PADDING_TW,
  CONTAINER_TW,
  ICON_SIZE_TW,
  LABEL_SIZE_TW,
  LABEL_WEIGHT_TW,
} from "./constants";

export const BaseButton = forwardRef<any, BaseButtonProps>(
  (
    {
      iconOnly,
      size,
      tw = "",
      labelTW = "",
      iconColor = "black",
      children,
      ...props
    },
    ref
  ) => {
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
      return React.Children.map(children, (child) => {
        if (typeof child === "string") {
          return <Text tw={labelStyle}>{child}</Text>;
        }

        // @ts-ignore
        return React.cloneElement(child, {
          tw: labelStyle,
          ...iconSize,
          color: iconColor,
          // @ts-ignore
          ...child.props,
        });
      });
    }, [size, iconColor, labelStyle, children]);

    return (
      <Pressable
        ref={ref}
        {...props}
        tw={containerStyle}
        children={renderChildren}
      />
    );
    //#endregion
  }
);

BaseButton.displayName = "BaseButton";
