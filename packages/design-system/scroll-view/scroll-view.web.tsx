import { ScrollView as ReactNativeScrollView } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

const StyledScrollView = styled(ReactNativeScrollView);

function ScrollView({ tw, ...props }: ScrollViewProps) {
  return (
    <StyledScrollView
      keyboardShouldPersistTaps="handled"
      {...props}
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
    />
  );
}

export { ScrollView };
