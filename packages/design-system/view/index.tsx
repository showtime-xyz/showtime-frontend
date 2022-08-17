import { ComponentProps, forwardRef } from "react";
import { Platform, View as ReactNativeView } from "react-native";

import { styled, tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type ViewProps = { tw?: TW } & ComponentProps<typeof ReactNativeView>;

const StyledView = styled(ReactNativeView);

const View = forwardRef(function View(
  { tw, style, ...props }: ViewProps,
  ref: any
) {
  return (
    <StyledView
      {...props}
      style={Platform.OS === "web" ? style : [tailwind.style(tw), style]}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      ref={ref}
    />
  );
});

View.displayName = "View";

export { View };
