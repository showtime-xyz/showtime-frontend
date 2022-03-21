import React, { ComponentProps } from "react";

import { View as DripsyView } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";

export type ViewProps = { tw?: string } & ComponentProps<typeof DripsyView>;

const View = React.forwardRef(function View(
  { tw, sx, ...props }: ViewProps,
  ref: any
) {
  return (
    <DripsyView sx={{ ...sx, ...tailwind.style(tw) }} {...props} ref={ref} />
  );
});

export { View };
