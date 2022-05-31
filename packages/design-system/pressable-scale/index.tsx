import React, { ComponentProps, useMemo } from "react";

import { MotiPressable, mergeAnimateProp } from "moti/interactions";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind/types";

export type Props = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
  tw?: TW;
};

export function PressableScale({
  animate,
  scaleTo = 0.95,
  tw,
  style,
  ...props
}: Props) {
  const animateValues = useMemo(
    () => (interaction) => {
      "worklet";

      return mergeAnimateProp(interaction, animate, {
        scale: interaction.pressed ? scaleTo : 1,
      });
    },
    [animate, scaleTo]
  );

  return (
    <MotiPressable
      animate={animateValues}
      style={[tailwind.style(tw), style]}
      {...props}
    />
  );
}
