import { ScrollView as ReactNativeScrollView } from "react-native";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

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
