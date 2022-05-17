import React, { ComponentProps, useMemo } from "react";

import { MotiPressable, mergeAnimateProp } from "moti/interactions";
import { useTailwind } from "tailwindcss-react-native";

import type { TW } from "design-system/tailwind/types";

export type Props = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
  tw?: TW;
  disablePressAnimation?: boolean;
};

export function Pressable({
  animate,
  scaleTo = 0.95,
  tw,
  style,
  disablePressAnimation = false,
  ...props
}: Props) {
  const tailwind = useTailwind();

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
      animate={disablePressAnimation ? undefined : animateValues}
      style={
        tw ? [tailwind(Array.isArray(tw) ? tw.join(" ") : tw), style] : style
      }
      {...props}
    />
  );
}
