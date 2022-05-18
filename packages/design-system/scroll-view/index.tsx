import { ComponentProps } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

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
