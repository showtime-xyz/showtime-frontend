import { ComponentProps } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { styled } from "tailwindcss-react-native";

import type { TW } from "design-system/tailwind/types";

type ScrollViewProps = { tw?: TW } & ComponentProps<
  typeof ReactNativeScrollView
>;

const StyledScrollView = styled(ReactNativeScrollView);

function ScrollView({ tw, ...props }: ScrollViewProps) {
  return (
    <StyledScrollView
      keyboardShouldPersistTaps="handled"
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      {...props}
    />
  );
}

export { ScrollView };
