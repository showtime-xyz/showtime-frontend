import React, { useCallback, useEffect } from "react";
import { BackHandler, StyleSheet, useWindowDimensions } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { TargetImageInfo } from "./light-box";
import type { AnimationParams } from "./provider";

export type ActiveImageType = AnimationParams & {
  layout: TargetImageInfo;
  imageElement: JSX.Element;
};
export type LightImageModalProps = {
  activeImage: ActiveImageType;
  onClose: () => void;
};
const timingConfig = {
  duration: 240,
  easing: Easing.bezier(0.33, 0.01, 0, 1),
};
export const LightImageModal = ({
  activeImage,
  onClose,
}: LightImageModalProps) => {
  const {
    layout,
    position,
    imageElement,
    onLongPress,
    tapToClose,
    onTap,
    borderRadius,
  } = activeImage;
  const { x, y, width, height, imageOpacity } = position;
  const { width: targetWidth, height: dimensionHeight } = useWindowDimensions();

  const scaleFactor = layout.width / targetWidth;

  const targetHeight = layout.height / scaleFactor;

  const headerHeight = 0;

  const animationProgress = useSharedValue(0);

  const backdropOpacity = useSharedValue(0);

  const scale = useSharedValue(1);

  const targetX = useSharedValue(0);
  const targetY = useSharedValue(
    (dimensionHeight - targetHeight) / 2 - headerHeight
  );

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .minPointers(1)
    .minDistance(10)
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = translationX;
      translateY.value = translationY;

      scale.value = interpolate(
        translateY.value,
        [-200, 0, 200],
        [0.65, 1, 0.65],
        Extrapolation.CLAMP
      );

      backdropOpacity.value = interpolate(
        translateY.value,
        [-100, 0, 100],
        [0.2, 1, 0.2],
        Extrapolation.CLAMP
      );
    })
    .onEnd(() => {
      if (Math.abs(translateY.value) > 40) {
        targetX.value = translateX.value - targetX.value * -1;
        targetY.value = translateY.value - targetY.value * -1;
        translateX.value = 0;
        translateY.value = 0;
        animationProgress.value = withTiming(0, timingConfig, () => {
          imageOpacity.value = withTiming(
            1,
            {
              duration: 16,
            },
            () => {
              runOnJS(onClose)();
            }
          );
        });
        backdropOpacity.value = withTiming(0, timingConfig);
      } else {
        backdropOpacity.value = withTiming(1, timingConfig);
        translateX.value = withTiming(0, timingConfig);
        translateY.value = withTiming(0, timingConfig);
      }
      scale.value = withTiming(1, timingConfig);
    });

  const imageStyles = useAnimatedStyle(() => {
    const interpolateProgress = (range: [number, number]) =>
      interpolate(animationProgress.value, [0, 1], range, Extrapolation.CLAMP);

    const top =
      translateY.value + interpolateProgress([y.value, targetY.value]);
    const left =
      translateX.value + interpolateProgress([x.value, targetX.value]);

    return {
      position: "absolute",
      width: interpolateProgress([width.value, targetWidth]),
      height: interpolateProgress([height.value, targetHeight]),
      transform: [
        {
          scale: scale.value,
        },
        {
          translateX: left,
        },
        {
          translateY: top,
        },
      ],
      borderRadius: borderRadius ? interpolateProgress([borderRadius, 0]) : 0,
    };
  });

  const backdropStyles = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });
  const closeModal = useCallback(() => {
    "worklet";
    animationProgress.value = withTiming(0, timingConfig, () => {
      imageOpacity.value = withTiming(
        1,
        {
          duration: 16,
        },
        () => {
          runOnJS(onClose)();
        }
      );
    });
    backdropOpacity.value = withTiming(0, timingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    requestAnimationFrame(() => {
      imageOpacity.value = 0;
    });
    animationProgress.value = withTiming(1, timingConfig);
    backdropOpacity.value = withTiming(1, timingConfig);
    const backhanderListener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        closeModal();
        return true;
      }
    );
    return () => {
      backhanderListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const longPressGesture = Gesture.LongPress()
    .enabled(!!onLongPress)
    .maxDistance(10)
    .onStart(() => {
      "worklet";
      if (onLongPress) {
        runOnJS(onLongPress)();
      }
    });

  // Todo: add pinch
  const pinchGesture = Gesture.Pinch().enabled(false);

  // Todo: add double tab
  const doubleTapGesture = Gesture.Tap().numberOfTaps(2).enabled(false);
  const tapGesture = Gesture.Tap()
    .enabled(tapToClose || !!onTap)
    .numberOfTaps(1)
    .maxDistance(10)
    .onEnd(() => {
      if (tapToClose) {
        closeModal();
      }
      if (onTap) {
        runOnJS(onTap)();
      }
    });
  return (
    <GestureDetector
      gesture={Gesture.Race(
        Gesture.Simultaneous(
          longPressGesture,
          Gesture.Race(panGesture, pinchGesture)
        ),
        Gesture.Exclusive(doubleTapGesture, tapGesture)
      )}
    >
      <Animated.View style={StyleSheet.absoluteFillObject}>
        <Animated.View style={[styles.backdrop, backdropStyles]} />
        <Animated.View style={[styles.imageStyle, imageStyles]}>
          {imageElement}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  imageStyle: {
    overflow: "hidden",
  },
});
