import { ComponentProps } from "react";
import { ActivityIndicator as ReactNativeActivityIndicator } from "react-native";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

type ActivityIndicatorProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeActivityIndicator
>;

function ActivityIndicator({ tw, style, ...props }: ActivityIndicatorProps) {
  return (
    <ReactNativeActivityIndicator
      color="#8b5cf6"
      {...props}
      style={{ ...tailwind.style(tw), ...(style as object) }}
    />
  );
}

export { ActivityIndicator };
