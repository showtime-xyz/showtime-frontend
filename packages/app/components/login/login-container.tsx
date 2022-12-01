import React from "react";
import { ViewProps } from "react-native";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";

import { useScrollToEnd } from "./useScrollToEnd";

export function LoginContainer({ style, children }: ViewProps) {
  const { scrollViewRef } = useScrollToEnd();

  return (
    <BottomSheetScrollView ref={scrollViewRef} style={style}>
      {children}
    </BottomSheetScrollView>
  );
}
