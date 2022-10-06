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

export function Pressable({ tw, ...props }: Props) {
  return (
    <StyledPressable {...props} tw={Array.isArray(tw) ? tw.join(" ") : tw} />
  );
}
