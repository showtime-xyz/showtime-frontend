import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type PressableProps = Omit<RNPressableProps, "tw"> & {
  tw?: TW;
};

const StyledPressable = styled(RNPressable);

export function Pressable({ tw, ...props }: PressableProps) {
  return (
    <StyledPressable {...props} tw={Array.isArray(tw) ? tw.join(" ") : tw} />
  );
}
