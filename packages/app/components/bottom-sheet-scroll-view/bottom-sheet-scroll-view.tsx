import { forwardRef } from "react";
import { Keyboard, Platform, ScrollView, ScrollViewProps } from "react-native";

import { BottomSheetScrollView as BottomSheetScrollViewComponent } from "@gorhom/bottom-sheet";

// https://github.com/facebook/react-native/issues/23364#issuecomment-642518054
// PR - https://github.com/facebook/react-native/pull/31943
const keyboardDismissProp = Platform.select({
  ios: { keyboardDismissMode: "on-drag" } as const,
  android: { onScrollEndDrag: Keyboard.dismiss } as const,
});

export const BottomSheetScrollView = forwardRef<ScrollView, ScrollViewProps>(
  function BottomSheetScrollView(props, ref) {
    const ScrollComponent =
      Platform.OS === "android"
        ? (BottomSheetScrollViewComponent as any)
        : ScrollView;

    return (
      <ScrollComponent
        keyboardShouldPersistTaps="handled"
        {...keyboardDismissProp}
        {...props}
        ref={ref}
      />
    );
  }
);
