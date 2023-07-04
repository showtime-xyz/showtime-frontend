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
  tw,
  disabled,
  ...props
}: PressableScaleProps) {
  return (
    <StyledMotiPressable
      {...props}
      disabled={disabled}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet";
            if (disabled) {
              return {};
            }
            return {
              scale: pressed ? scaleTo : 1,
            };
          },
        [disabled, scaleTo]
      )}
    />
  );
}
