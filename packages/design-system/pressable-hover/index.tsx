import { useMemo } from "react";
import {
  Pressable as ReactNativePressable,
  PressableProps,
} from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type Props = Omit<PressableProps, "tw"> & {
  tw?: TW;
};

const StyledPressable = styled(ReactNativePressable);

export function PressableHover({ tw, ...props }: Props) {
  const twWithHover = useMemo(
    () =>
      [
        "hover:opacity-80 dark:hover:opacity-90",
        Array.isArray(tw) ? tw.join(" ") : tw,
      ].join(" "),
    [tw]
  );

  return <StyledPressable {...props} tw={twWithHover} />;
}
