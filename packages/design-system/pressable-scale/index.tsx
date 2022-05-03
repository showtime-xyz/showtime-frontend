import React, { ComponentProps } from "react";
import { Pressable as RNPressable } from "react-native";

import { MotiPressable } from "moti/interactions";
import Reanimated from "react-native-reanimated";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

const AnimatedPressable = Reanimated.createAnimatedComponent(RNPressable);

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
  return <AnimatedPressable style={[tailwind.style(tw), style]} {...props} />;
}
