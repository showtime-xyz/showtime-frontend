import React, { useCallback, useMemo } from "react";
import type { LayoutChangeEvent, ViewProps } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";

export type PinchToZoomProps = {
  children: React.ReactNode;
  minimumZoomScale?: number;
  maximumZoomScale?: number;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  disabled?: boolean;
} & ViewProps;

export function PinchToZoom(props: PinchToZoomProps) {
  const {
    minimumZoomScale = 1,
    maximumZoomScale = 8,
    style: propStyle,
    onPinchStart,
    onPinchEnd,
    disabled,
    onLayout,
  } = props;

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isPinching = useSharedValue(false);
  const viewHeight = useSharedValue(0);
  const viewWidth = useSharedValue(0);

  const prevScale = useSharedValue(0);
  const offsetScale = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const panTranslateX = useSharedValue(0);
  const panTranslateY = useSharedValue(0);
  const prevPointers = useSharedValue(0);
  const offsetFromFocalX = useSharedValue(0);
  const offsetFromFocalY = useSharedValue(0);

  const gesture = useMemo(() => {
    const pinch = Gesture.Pinch()
      .enabled(!disabled)
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
        prevScale.value = scale.value;
        offsetScale.value = scale.value;
        if (onPinchStart) runOnJS(onPinchStart)();
      })
      .onUpdate((e) => {
        if (e.numberOfPointers !== prevPointers.value) {
          prevTranslationX.value = translationX.value;
          prevTranslationY.value = translationY.value;
          offsetFromFocalX.value = e.focalX;
          offsetFromFocalY.value = e.focalY;
          prevPointers.value = e.numberOfPointers;
        }

        if (e.numberOfPointers === 1) {
          translationX.value =
            prevTranslationX.value + e.focalX - offsetFromFocalX.value;
          translationY.value =
            prevTranslationY.value + e.focalY - offsetFromFocalY.value;
          isPinching.value = false;
        } else if (e.numberOfPointers === 2) {
          const newScale = prevScale.value * e.scale;

          if (newScale < minimumZoomScale || newScale > maximumZoomScale)
            return;

          scale.value = newScale;

          // reset the origin
          if (!isPinching.value) {
            isPinching.value = true;
            originX.value = e.focalX;
            originY.value = e.focalY;
            prevTranslationX.value = translationX.value;
            prevTranslationY.value = translationY.value;
            offsetScale.value = scale.value;
          }

          if (isPinching.value) {
            // translate the image to the focal point as we're zooming
            translationX.value =
              prevTranslationX.value +
              -1 *
                ((scale.value - offsetScale.value) *
                  (originX.value - viewWidth.value / 2));
            translationY.value =
              prevTranslationY.value +
              -1 *
                ((scale.value - offsetScale.value) *
                  (originY.value - viewHeight.value / 2));
          }
        }
      })
      .onEnd(() => {
        isPinching.value = false;
        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;

        translationX.value = withTiming(0);
        translationY.value = withTiming(0);
        scale.value = withTiming(1);
        originX.value = 0;
        originY.value = 0;
        isPinching.value = false;
        prevScale.value = 0;
        prevTranslationX.value = 0;
        prevTranslationY.value = 0;
        panTranslateX.value = 0;
        panTranslateY.value = 0;

        if (onPinchEnd) runOnJS(onPinchEnd)();
      });

    return pinch;

    // only add prop dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maximumZoomScale, minimumZoomScale, onPinchEnd, onPinchStart, disabled]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        {...props}
        onLayout={useCallback(
          (e: LayoutChangeEvent) => {
            viewHeight.value = e.nativeEvent.layout.height;
            viewWidth.value = e.nativeEvent.layout.width;
            onLayout?.(e);
          },
          [viewHeight, viewWidth, onLayout]
        )}
        style={useMemo(() => [style, propStyle], [style, propStyle])}
      />
    </GestureDetector>
  );
}
