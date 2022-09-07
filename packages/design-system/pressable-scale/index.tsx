import { ComponentProps, useMemo } from "react";

import { MotiPressable, mergeAnimateProp } from "moti/interactions";

export type Props = ComponentProps<typeof MotiPressable> & {
  scaleTo?: number;
};

export function PressableScale({ animate, scaleTo = 0.95, ...props }: Props) {
  const animateValues = useMemo(
    () => (interaction: any) => {
      "worklet";

      return mergeAnimateProp(interaction, animate, {
        scale: interaction.pressed ? scaleTo : 1,
      });
    },
    [animate, scaleTo]
  );

  return <MotiPressable animate={animateValues} {...props} />;
}
