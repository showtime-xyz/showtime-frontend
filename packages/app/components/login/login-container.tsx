import React from "react";
import { Platform, ViewProps } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { View } from "design-system";

import { useScrollToEnd } from "./useScrollToEnd";

const ContainerView: any =
  Platform.OS === "android" ? BottomSheetScrollView : View;

export function LoginContainer({ style, children }: ViewProps) {
  const { scrollViewRef } = useScrollToEnd();

  return (
    <ContainerView
      ref={scrollViewRef}
      style={style}
      contentContainerStyle={{
        paddingTop: 16,
      }}
    >
      {children}
    </ContainerView>
  );
}
