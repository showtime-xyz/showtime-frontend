import React, { RefObject, useEffect } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, View } from "react-native";

import { ImageStyle } from "react-native-fast-image";
// import { useHeaderHeight } from "@react-navigation/elements";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Image } from "../image";
import {
  ImageBoundingClientRect,
  LightImageProps,
  TargetImageInfo,
} from "./light-box-image";

export type ActiveImageType = ImageBoundingClientRect & {
  layout: TargetImageInfo;
  style?: StyleProp<ImageStyle>;
  source: LightImageProps["source"];
};
const timingConfig = {
  duration: 240,
  easing: Easing.bezier(0.33, 0.01, 0, 1),
};
export const LightImageModal = ({
  activeImage,
  onClose,
}: {
  activeImage: ActiveImageType;
  onClose: () => void;
}) => {
  const { layout, x, y, width, height, imageOpacity, style, source } =
    activeImage;
  const { width: targetWidth, height: dimensionHeight } = useWindowDimensions();

  const scaleFactor = layout.width / targetWidth;

  const targetHeight = layout.height / scaleFactor;

  // const headerHeight = useHeaderHeight();
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
  // Todo: add pinch zoom
  const onPan = Gesture.Pan()
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
        Extrapolate.CLAMP
      );

      backdropOpacity.value = interpolate(
        translateY.value,
        [-100, 0, 100],
        [0, 1, 0],
        Extrapolate.CLAMP
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
      interpolate(animationProgress.value, [0, 1], range, Extrapolate.CLAMP);
    const top =
      translateY.value + interpolateProgress([y.value, targetY.value]);
    const left =
      translateX.value + interpolateProgress([x.value, targetX.value]);
    return {
      position: "absolute",
      top,
      left,
      width: interpolateProgress([width.value, targetWidth]),
      height: interpolateProgress([height.value, targetHeight]),
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  const backdropStyles = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      imageOpacity.value = 0;
    });
    animationProgress.value = withTiming(1, timingConfig);
    backdropOpacity.value = withTiming(1, timingConfig);
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Animated.View style={[styles.backdrop, backdropStyles]} />
      {/* @ts-ignore */}
      <GestureDetector gesture={onPan}>
        <Animated.View style={imageStyles}>
          <Image
            source={source}
            style={StyleSheet.flatten([StyleSheet.absoluteFillObject, style])}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    backgroundColor: "#fff",
  },

  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
});
