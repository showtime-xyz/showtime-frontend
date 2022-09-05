import { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";

import { useIsDarkMode, useOnHover } from "@showtime-xyz/universal.hooks";
import {
  styled,
  colors,
  tw as tailwind,
} from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type Props = ComponentProps<typeof MotiPressable> & {
  tw?: TW;
  /**
   * **DESKTOP WEB_ONLY**
   * css hover effect
   * default @false
   */
  disableHoverEffect?: boolean;
};

const StyledMotiPressable = styled(MotiPressable);

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
      style={[hoverStyle, style, tailwind.style(tw)]} // TODO: don't use `tailwind.style`
      {...props}
      // tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  );
}
