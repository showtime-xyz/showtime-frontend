import React, { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";

import { useIsDarkMode, useOnHover } from "design-system/hooks";
import { tw as tailwind, colors } from "design-system/tailwind";
import type { TW } from "design-system/tailwind";

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

  const hoverStyle = useMemo(() => {
    if (disableHoverEffect) {
      return { backgroundColor: "transparent" };
    }
    return {
      backgroundColor: hovered.value
        ? isDark
          ? colors.gray[800]
          : colors.gray[200]
        : "transparent",
      transitionDuration: "150ms",
    };
  }, [disableHoverEffect, hovered.value, isDark]);

  return (
    <MotiPressable
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      style={[hoverStyle, tailwind.style(tw), style]}
      {...props}
    />
  );
}
