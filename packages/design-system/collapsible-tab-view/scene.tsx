import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { useHeaderTabContext } from "./context";
import { useSharedScrollableRef, useSyncInitialPosition } from "./hooks";
import type { SceneProps } from "./types";

export function SceneComponent<P extends object>({
  index,
  onScroll: propOnScroll,
  onContentSizeChange,
  ContainerView,
  contentContainerStyle,
  scrollIndicatorInsets,
  forwardedRef,
  ...restProps
}: SceneProps<P>) {
  //#region refs
  const nativeGestureRef = useRef(Gesture.Native());
  const scollViewRef =
    useSharedScrollableRef<Animated.ScrollView>(forwardedRef);
  //#endregion

  //#region hooks
  const {
    shareAnimatedValue,
    tabbarHeight,
    headerHeight,
    expectHeight,
    curIndexValue,
    refHasChanged,
    updateSceneInfo,
    scrollStickyHeaderHeight,
  } = useHeaderTabContext();
  //#endregion

  //#region animations/style
  const scrollY = useSharedValue(0);
  const { opacityValue, initialPosition } =
    useSyncInitialPosition(scollViewRef);
  const sceneStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacityValue.value),
    };
  }, [opacityValue]);
  const calcHeight = useMemo(() => {
    return tabbarHeight + headerHeight;
  }, [tabbarHeight, headerHeight]);

  const scrollViewPaddingTop = useMemo(() => {
    return calcHeight + scrollStickyHeaderHeight;
  }, [calcHeight, scrollStickyHeaderHeight]);
  //#endregion

  //#region methods
  const onScrollAnimateEvent = useAnimatedScrollHandler({
    onScroll: (e) => {
      const moveY = Math.max(e.contentOffset.y, 0);
      scrollY.value = Math.max(moveY, 0);
      if (curIndexValue.value !== index) return;
      shareAnimatedValue.value = moveY;
      if (propOnScroll) {
        runOnJS(propOnScroll as any)({ nativeEvent: e });
      }
    },
  });
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
  //#endregion

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

  return (
    <Animated.View style={[styles.container, sceneStyle]}>
      <GestureDetector gesture={nativeGestureRef.current}>
        <ContainerView
          {...restProps}
          ref={scollViewRef}
          scrollEventThrottle={16}
          directionalLockEnabled
          contentContainerStyle={StyleSheet.flatten([
            contentContainerStyle,
            {
              paddingTop: scrollViewPaddingTop,
              minHeight: expectHeight,
            },
          ])}
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
