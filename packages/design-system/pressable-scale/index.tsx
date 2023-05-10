import { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";
import { styled } from "nativewind";

export type PressableScaleProps = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
  role?: string;
  tw?: string;
};
const StyledMotiPressable = styled(MotiPressable);
export function PressableScale({
  scaleTo = 0.95,
  role,
  ...props
}: PressableScaleProps) {
  return (
    <StyledMotiPressable
      {...props}
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
