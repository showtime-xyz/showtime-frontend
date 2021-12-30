import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const useLayout = () => {
  const [layout, setLayout] = useState<
    LayoutChangeEvent["nativeEvent"]["layout"] | undefined
  >();
  const onLayout = (e) => {
    setLayout(e.nativeEvent.layout);
  };

  return { onLayout, layout };
};

export const PinchToZoom = ({ children }) => {
  const scale = useSharedValue(1);
  const origin = { x: useSharedValue(0), y: useSharedValue(0) };
  const translation = { x: useSharedValue(0), y: useSharedValue(0) };
  const { onLayout, layout } = useLayout();

  const imageLeft = layout ? -layout.height / 2 : 0;
  const imageTop = layout ? -layout.width / 2 : 0;

  const handler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart(e, ctx: any) {
      // On android, we get focalX and focalY always 0 in onStart callback
      // 😢 https://github.com/software-mansion/react-native-gesture-handler/issues/546
      ctx.start = true;
    },

    onActive(e, ctx: any) {
      if (ctx.start) {
        origin.x.value = e.focalX;
        origin.y.value = e.focalY;

        ctx.offsetFromFocalX = origin.x.value;
        ctx.offsetFromFocalY = origin.y.value;
        ctx.prevTranslateOriginX = origin.x.value;
        ctx.prevTranslateOriginY = origin.y.value;
        ctx.prevPointers = e.numberOfPointers;

        ctx.start = false;
      }

      scale.value = e.scale;

      if (ctx.prevPointers !== e.numberOfPointers) {
        ctx.offsetFromFocalX = e.focalX;
        ctx.offsetFromFocalY = e.focalY;
        ctx.prevTranslateOriginX = ctx.translateOriginX;
        ctx.prevTranslateOriginY = ctx.translateOriginY;
      }

      ctx.translateOriginX =
        ctx.prevTranslateOriginX + e.focalX - ctx.offsetFromFocalX;
      ctx.translateOriginY =
        ctx.prevTranslateOriginY + e.focalY - ctx.offsetFromFocalY;

      translation.x.value = ctx.translateOriginX - origin.x.value;
      translation.y.value = ctx.translateOriginY - origin.y.value;

      ctx.prevPointers = e.numberOfPointers;
    },
    onEnd() {
      scale.value = withSpring(1, {
        stiffness: 60,
        overshootClamping: true,
      });
      translation.x.value = withSpring(0, {
        stiffness: 60,
        overshootClamping: true,
      });
      translation.y.value = withSpring(0, {
        stiffness: 60,
        overshootClamping: true,
      });
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translation.x.value },
        {
          translateY: translation.y.value,
        },

        { translateX: imageLeft + origin.x.value },
        { translateY: imageTop + origin.y.value },
        {
          scale: scale.value,
        },
        { translateX: -(imageLeft + origin.x.value) },
        { translateY: -(imageTop + origin.y.value) },
      ],
    };
  }, [imageTop, imageLeft]);

  const clonedChildren = useMemo(
    () =>
      React.cloneElement(children, {
        style: [StyleSheet.flatten(children.props.style), animatedStyles],
      }),
    [children]
  );

  return (
    <PinchGestureHandler onGestureEvent={handler}>
      <Animated.View onLayout={onLayout}>{clonedChildren}</Animated.View>
    </PinchGestureHandler>
  );
};
