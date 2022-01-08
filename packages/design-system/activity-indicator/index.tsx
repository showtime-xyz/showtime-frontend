import { ComponentProps } from "react";
import { ActivityIndicator as DripsyActivityIndicator } from "dripsy";

import { tw as tailwind } from "@showtime/universal-ui.tailwind";
import type { TW } from "@showtime/universal-ui.tailwind";

type ActivityIndicatorProps = { tw?: TW } & ComponentProps<
  typeof DripsyActivityIndicator
>;

function ActivityIndicator({ tw, sx, ...props }: ActivityIndicatorProps) {
  return (
    <DripsyActivityIndicator
      color="#8b5cf6"
      sx={{ ...sx, ...tailwind.style(tw) }}
      {...props}
    />
  );
}

export { ActivityIndicator };
