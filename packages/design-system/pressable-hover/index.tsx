import { useMemo, useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  const twWithHover = useMemo(
    () =>
      [
        "hover:opacity-80 dark:hover:opacity-90",
        Array.isArray(tw) ? tw.join(" ") : tw,
      ].join(" "),
    [tw]
  );
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return <StyledPressable {...props} tw={twWithHover} />;
}
