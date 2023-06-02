import { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";

export type PressableScaleProps = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
  role?: string;
};

export function PressableScale({
  scaleTo = 0.95,
  role,
  ...props
}: PressableScaleProps) {
  return (
    <MotiPressable
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
