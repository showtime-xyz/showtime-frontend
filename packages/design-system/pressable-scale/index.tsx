import { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";
import { styled } from "nativewind";

import { TW } from "@showtime-xyz/universal.tailwind";

export type PressableScaleProps = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
  role?: string;
  tw?: TW;
};
const StyledMotiPressable = styled(MotiPressable);
export function PressableScale({
  scaleTo = 0.95,
  role,
  tw,
  ...props
}: PressableScaleProps) {
  return (
    <StyledMotiPressable
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet";
            return {
              scale: pressed ? scaleTo : 1,
            };
          },
        [scaleTo]
      )}
    />
  );
}
