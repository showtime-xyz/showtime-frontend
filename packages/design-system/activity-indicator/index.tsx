import { ComponentProps } from "react";
import { ActivityIndicator as ReactNativeActivityIndicator } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

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
