import { ComponentProps, forwardRef } from "react";
import { View as ReactNativeView } from "react-native";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

export type ViewProps = { tw?: TW } & ComponentProps<typeof ReactNativeView>;

const View = forwardRef(function View(
  { tw, style, ...props }: ViewProps,
  ref: any
) {
  return (
    <ReactNativeView
      {...props}
      style={{ ...tailwind.style(tw), ...(style as object) }}
      ref={ref}
    />
  );
});

export { View };
