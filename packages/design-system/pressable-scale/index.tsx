import { ComponentProps, useMemo } from "react";

import { MotiPressable } from "moti/interactions";

export type Props = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
};

export function PressableScale({ scaleTo = 0.95, ...props }: Props) {
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
