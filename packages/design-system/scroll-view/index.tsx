import { ComponentProps } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind/types";

type ScrollViewProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeScrollView
>;

function ScrollView({ tw, style, ...props }: ScrollViewProps) {
  return (
    <ReactNativeScrollView
      keyboardShouldPersistTaps="handled"
      {...props}
      style={[tailwind.style(tw), style]}
    />
  );
}

export { ScrollView };
