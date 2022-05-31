import { ComponentProps } from "react";
import { ActivityIndicator as ReactNativeActivityIndicator } from "react-native";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind/types";

type ActivityIndicatorProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeActivityIndicator
>;

function ActivityIndicator({ tw, style, ...props }: ActivityIndicatorProps) {
  return (
    <ReactNativeActivityIndicator
      color="#8b5cf6"
      {...props}
      style={[tailwind.style(tw), style]}
    />
  );
}

export { ActivityIndicator };
