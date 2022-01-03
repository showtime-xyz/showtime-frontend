import React, { ComponentProps, useMemo } from "react";
import { MotiPressable, mergeAnimateProp } from "moti/interactions";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

export type Props = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
  tw?: TW;
};

export function Pressable({
  animate,
  scaleTo = 0.95,
  tw,
  style,
  ...props
}: Props) {
  return (
    <MotiPressable
      animate={useMemo(
        () => (interaction) => {
          "worklet";

          return mergeAnimateProp(interaction, animate, {
            scale: interaction.pressed ? scaleTo : 1,
          });
        },
        [animate, scaleTo]
      )}
      style={[tailwind.style(tw), style]}
      {...props}
    />
  );
}
