import { ComponentProps } from "react";
import { ActivityIndicator as ReactNativeActivityIndicator } from "react-native";

import { styled } from "tailwindcss-react-native";

import type { TW } from "design-system/tailwind/types";

type ActivityIndicatorProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeActivityIndicator
>;

const StyledActivityIndicator = styled(ReactNativeActivityIndicator);

function ActivityIndicator({ tw, ...props }: ActivityIndicatorProps) {
  return (
    <StyledActivityIndicator
      color="#8b5cf6"
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  );
}

export { ActivityIndicator };
