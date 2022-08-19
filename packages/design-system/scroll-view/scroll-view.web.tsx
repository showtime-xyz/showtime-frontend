import { forwardRef } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

const StyledScrollView = styled(ReactNativeScrollView);

const ScrollView = forwardRef(function ScrollView(
  { tw, ...props }: ScrollViewProps,
  ref: any
) {
  return (
    <StyledScrollView
      keyboardShouldPersistTaps="handled"
      {...props}
      ref={ref}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  );
});

export { ScrollView };
