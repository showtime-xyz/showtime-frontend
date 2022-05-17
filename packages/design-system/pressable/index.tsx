import React, { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

import { useIsDarkMode, useOnHover } from "../hooks";
import { colors } from "../tailwind/colors";

export type Props = ComponentProps<typeof MotiPressable> & {
  tw?: TW;
  /**
   * **DESKTOP WEB_ONLY**
   * css hover effect
   * default @false
   */
  disableHoverEffect?: boolean;
};

export function Pressable({
  tw,
  style,
  disableHoverEffect = false,
  ...props
}: Props) {
  const { onHoverIn, onHoverOut, hovered } = useOnHover();
  const isDark = useIsDarkMode();
  const backgroundColor = useMemo(() => {
    if (disableHoverEffect) {
      return "transparent";
    }
    return hovered.value
      ? isDark
        ? colors.gray[800]
        : colors.gray[200]
      : "transparent";
  }, [disableHoverEffect, hovered.value, isDark]);
  return (
    <MotiPressable
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      style={[
        {
          backgroundColor,
          transitionDuration: "150ms",
        },
        tailwind.style(tw),
        style,
      ]}
      {...props}
    />
  );
}
