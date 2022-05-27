import { ComponentProps, forwardRef } from "react";
import { View as ReactNativeView } from "react-native";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type ViewProps = { tw?: TW } & ComponentProps<typeof ReactNativeView>;

const View = forwardRef(function View(
  { tw, style, ...props }: ViewProps,
  ref: any
) {
  return (
    <ReactNativeView {...props} style={[tailwind.style(tw), style]} ref={ref} />
  );
});

export { View };
