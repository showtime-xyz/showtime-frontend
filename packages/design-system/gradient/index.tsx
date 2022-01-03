import { ComponentProps } from "react";
import { Gradient as DripsyGradient } from "@dripsy/gradient";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

type GradientProps = { tw?: TW; borderRadius?: number } & ComponentProps<
  typeof DripsyGradient
>;

function Gradient({
  sx,
  tw,
  borderRadius,
  colors,
  locations,
  ...props
}: GradientProps) {
  return (
    <DripsyGradient
      sx={tailwind.style(sx as {}, tw, { borderRadius })}
      colors={colors}
      locations={locations}
      stretch={true}
      {...props}
    />
  );
}

export { Gradient };
