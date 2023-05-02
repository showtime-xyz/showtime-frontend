import React from "react";
import { ScrollViewProps, StyleSheet } from "react-native";

import type { SceneProps } from "./types";

export function SceneComponent<P extends ScrollViewProps>({
  index,
  onScroll,
  ContainerView,
  contentContainerStyle,
  forwardedRef,
  style,
  ...restProps
}: SceneProps<P>) {
  return (
    <ContainerView
      ref={forwardedRef}
      scrollEventThrottle={16}
      directionalLockEnabled
      style={[styles.container, style]}
      onScroll={onScroll}
      contentContainerStyle={[contentContainerStyle]}
      bounces={false}
      {...restProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
