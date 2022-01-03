import { ComponentProps } from "react";
import { View as DripsyView } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";

export type ViewProps = { tw?: string | string[] } & ComponentProps<typeof DripsyView>;

function View({ tw, sx, ...props }: ViewProps) {
  return <DripsyView sx={{ ...sx, ...tailwind.style(tw) }} {...props} />;
}

export { View };
