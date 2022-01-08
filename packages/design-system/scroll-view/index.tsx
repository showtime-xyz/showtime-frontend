import { ComponentProps } from "react";
import { ScrollView as DripsyScrollView } from "dripsy";

import { tw as tailwind } from "@showtime/universal-ui.tailwind";
import type { TW } from "@showtime/universal-ui.tailwind";

type ScrollViewProps = { tw?: TW } & ComponentProps<typeof DripsyScrollView>;

function ScrollView({ tw, sx, ...props }: ScrollViewProps) {
  return <DripsyScrollView sx={{ ...sx, ...tailwind.style(tw) }} {...props} />;
}

export { ScrollView };
