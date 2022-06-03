import React, { useEffect } from "react";
import { ScrollViewProps, StyleSheet } from "react-native";

import Animated, { useSharedValue } from "react-native-reanimated";

import { useHeaderTabContext } from "./context";
import { useSharedScrollableRef } from "./hooks";
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
  if (onScroll !== undefined) {
    console.warn(
      `Don't support the custom onScroll, please use the 'useHeaderTabContext' hooks!`
    );
  }
  const { tabbarHeight, updateSceneInfo } = useHeaderTabContext();
  const scollViewRef =
    useSharedScrollableRef<Animated.ScrollView>(forwardedRef);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    if (scollViewRef && scollViewRef.current) {
      updateSceneInfo({
        scrollRef: scollViewRef,
        index,
        scrollY,
      });
    }
  }, [scollViewRef, index, scrollY, updateSceneInfo]);

  return (
    //@ts-ignore
    <ContainerView
      ref={scollViewRef}
      scrollEventThrottle={16}
      directionalLockEnabled
      style={[styles.container, style]}
      contentContainerStyle={[
        {
          paddingTop: tabbarHeight,
        },
        contentContainerStyle,
      ]}
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
