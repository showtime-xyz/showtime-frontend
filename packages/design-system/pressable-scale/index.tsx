import { ComponentProps, useMemo } from "react";

import { MotiPressable, mergeAnimateProp } from "moti/interactions";

import { styled, tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type Props = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
  tw?: TW;
};

const StyledMotiPressable = styled(MotiPressable);

export function PressableScale({
  animate,
  scaleTo = 0.95,
  tw,
  style,
  ...props
}: Props) {
  const animateValues = useMemo(
    () => (interaction: any) => {
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
      {...props}
      style={[tailwind.style(tw), style]} // TODO: don't use `tailwind.style`
      // tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  );
}
