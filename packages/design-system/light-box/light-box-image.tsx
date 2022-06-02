import React, { useState } from "react";
import { ViewStyle, StyleSheet, StyleProp, Dimensions } from "react-native";

import {
  FastImageProps,
  ImageStyle,
  OnLoadEvent,
} from "react-native-fast-image";
// import { useHeaderHeight } from "@react-navigation/elements";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";

import { AnimationParams, useLightBox } from "./index";

// const AnimatedImage = Animated.createAnimatedComponent(FastImage as any);
export type ImageBoundingClientRect = {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  width: Animated.SharedValue<number>;
  height: Animated.SharedValue<number>;
  imageOpacity: Animated.SharedValue<number>;
};
export type TargetImageInfo = {
  width: number;
  height: number;
};
export type LightImageProps = FastImageProps & {
  width: number;
  height: number;
  containerStyle?: StyleProp<ViewStyle>;
  style?: ImageStyle;
  imgLayout?: TargetImageInfo;
  alt?: string;
};

export const LightBoxImg = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  style,
  source,
  imgLayout,
  ...rest
}: LightImageProps) => {
  const [targetLayout, setTargetLayout] = useState<
    AnimationParams["layout"] | null
  >(null);

  const animatedRef = useAnimatedRef<Animated.View>();
  const opacity = useSharedValue(1);
  const lightBox = useLightBox();

  // const headerHeight = useHeaderHeight();
  const headerHeight = 0;
  const styles = useAnimatedStyle(() => {
    return {
      width: imgWidth,
      height: imgHeight,
      opacity: opacity.value,
    };
  });
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const handlePress = () => {
    if (!targetLayout && !imgLayout) return;
    const position = { imageOpacity: opacity, width, height, x, y };
    lightBox?.show({
      position,
      style,
      layout: targetLayout ??
        imgLayout ?? {
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").width,
        },
      source,
    });
  };

  const gesture = Gesture.Tap().onEnd((_, success) => {
    if (!success) return;
    const measurements = measure(animatedRef);
    width.value = measurements.width;
    height.value = measurements.height;
    x.value = measurements.pageX;
    y.value = measurements.pageY - headerHeight;
    runOnJS(handlePress)();
  });
  const onImgLoad = (e: OnLoadEvent) => {
    if (imgLayout) return;
    setTargetLayout({
      width: e.nativeEvent.width,
      height: e.nativeEvent.height,
    });
  };
  return (
    // @ts-ignore
    <GestureDetector gesture={gesture}>
      <Animated.View style={containerStyle}>
        <Animated.View ref={animatedRef} style={styles}>
          <Image
            onLoad={onImgLoad}
            style={[StyleSheet.absoluteFillObject, style]}
            source={source}
            {...rest}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
