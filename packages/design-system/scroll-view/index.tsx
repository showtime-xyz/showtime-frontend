import { ComponentProps } from "react";
import { ScrollView as DripsyScrollView } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

type ScrollViewProps = { tw?: TW } & ComponentProps<typeof DripsyScrollView>;

function ScrollView({ tw, sx, ...props }: ScrollViewProps) {
  return (
    <DripsyScrollView
      keyboardShouldPersistTaps="handled"
      sx={{ ...sx, ...tailwind.style(tw) }}
      {...props}
    />
  );
}

export { ScrollView };
