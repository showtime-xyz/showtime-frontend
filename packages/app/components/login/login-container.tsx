import React from "react";
import { Platform, ViewProps } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { ScrollView } from "@showtime-xyz/universal.scroll-view";

import { useScrollToEnd } from "./useScrollToEnd";

const ContainerView: any =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

export function LoginContainer({ style, children }: ViewProps) {
  const { scrollViewRef } = useScrollToEnd();

  return (
    <ContainerView ref={scrollViewRef} style={style}>
      {children}
    </ContainerView>
  );
}
