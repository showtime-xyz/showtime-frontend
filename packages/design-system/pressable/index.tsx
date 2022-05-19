import { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";
import { useTailwind } from "tailwindcss-react-native";

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
  const tailwind = useTailwind();
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
      {...props}
      style={[
        hoverStyle,
        tailwind(Array.isArray(tw) ? tw.join(" ") : tw),
        style,
      ]}
    />
  );
}
