import { ComponentProps, useMemo } from "react";
import { Pressable as ReactNativePressable } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type Props = ComponentProps<typeof ReactNativePressable> & {
  tw?: TW;
  /**
   * **DESKTOP WEB_ONLY**
   * css hover effect
   * default @false
   */
  disableHoverEffect?: boolean;
};

const StyledPressable = styled(ReactNativePressable);

export function Pressable({ tw, disableHoverEffect = false, ...props }: Props) {
  const twWithHover = useMemo(
    () =>
      [
        disableHoverEffect ? "" : "hover:bg-gray-200 dark:hover:bg-gray-800",
        Array.isArray(tw) ? tw.join(" ") : tw,
      ].join(" "),
    [tw, disableHoverEffect]
  );

  return <StyledPressable {...props} tw={twWithHover} />;
}
