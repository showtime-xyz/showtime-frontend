import { forwardRef } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

const ScrollView = forwardRef(function ScrollView(
  { tw, style, ...props }: ScrollViewProps,
  ref: any
) {
  return (
    <ReactNativeScrollView
      keyboardShouldPersistTaps="handled"
      {...props}
      ref={ref}
      style={[tailwind.style(tw), style]}
    />
  );
});

export { ScrollView };
