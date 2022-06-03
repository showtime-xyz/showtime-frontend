import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useHeaderTabContext } from "./context";
import { useSharedScrollableRef } from "./hooks/use-shared-scrollable-ref";
import { useSyncInitialPosition } from "./hooks/use-sync-initial-position";
import type { SceneProps } from "./types";

export function SceneComponent<P extends object>({
  index,
  onScroll,
  onContentSizeChange,
  ContainerView,
  contentContainerStyle,
  scrollIndicatorInsets,
  forwardedRef,
  ...restProps
}: SceneProps<P>) {
  if (onScroll !== undefined) {
    console.warn(
      `Don't support the custom onScroll, please use the 'useHeaderTabContext' hooks!`
    );
  }
  const {
    shareAnimatedValue,
    tabbarHeight,
    headerHeight,
    expectHeight,
    curIndexValue,
    refHasChanged,
    updateSceneInfo,
  } = useHeaderTabContext();
  const scollViewRef =
    useSharedScrollableRef<Animated.ScrollView>(forwardedRef);

  const nativeGestureRef = useRef(Gesture.Native());
  const scrollY = useSharedValue(0);
  const { opacityValue, initialPosition } =
    useSyncInitialPosition(scollViewRef);

  const calcHeight = useMemo(() => {
    return tabbarHeight + headerHeight;
  }, [tabbarHeight, headerHeight]);

  const onScrollAnimateEvent = useAnimatedScrollHandler({
    onScroll: (e) => {
      const moveY = Math.max(e.contentOffset.y, 0);
      scrollY.value = Math.max(moveY, 0);
      if (curIndexValue.value !== index) return;
      shareAnimatedValue.value = moveY;
    },
  });

  useEffect(() => {
    refHasChanged?.(nativeGestureRef.current);
  }, [refHasChanged]);

  useEffect(() => {
    if (scollViewRef && scollViewRef.current) {
      updateSceneInfo({
        scrollRef: scollViewRef,
        index,
        scrollY,
      });
    }
  }, [scollViewRef, index, scrollY, updateSceneInfo]);

  // adjust the scene size
  const _onContentSizeChange = useCallback(
    (contentWidth: number, contentHeight: number) => {
      onContentSizeChange?.(contentWidth, contentHeight);
      if (Math.ceil(contentHeight) >= expectHeight) {
        initialPosition(shareAnimatedValue.value);
      }
    },
    [onContentSizeChange, initialPosition, expectHeight, shareAnimatedValue]
  );

  const sceneStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacityValue.value),
    };
  }, [opacityValue]);
  return (
    <Animated.View style={[styles.container, sceneStyle]}>
      {/* @ts-ignore */}
      <GestureDetector gesture={nativeGestureRef.current}>
        {/* @ts-ignore */}
        <ContainerView
          ref={scollViewRef}
          scrollEventThrottle={16}
          directionalLockEnabled
          // @ts-ignore
          contentContainerStyle={[
            {
              paddingTop: calcHeight,
              minHeight: expectHeight,
            },
            contentContainerStyle,
          ]}
          onContentSizeChange={_onContentSizeChange}
          onScroll={onScrollAnimateEvent}
          scrollIndicatorInsets={{
            top: headerHeight,
            ...scrollIndicatorInsets,
          }}
          bounces={false}
          {...restProps}
        />
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
