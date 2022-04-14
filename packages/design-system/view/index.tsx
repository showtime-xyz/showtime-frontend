import React, { ComponentProps } from "react";

import { View as DripsyView } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

export type ViewProps = { tw?: TW } & ComponentProps<typeof DripsyView>;

const View = React.forwardRef(function View(
  { tw, sx, ...props }: ViewProps,
  ref: any
) {
  return (
    <DripsyView sx={{ ...sx, ...tailwind.style(tw) }} {...props} ref={ref} />
  );
});

export { View };
