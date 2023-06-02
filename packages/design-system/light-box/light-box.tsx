import React, { useState } from "react";
import { Dimensions, StyleProp, ViewStyle } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { AnimationParams, useLightBox } from "./provider";

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
export type LightBoxProps = {
  width: number;
  height: number;
  containerStyle?: StyleProp<ViewStyle>;
  imgLayout?: TargetImageInfo;
  alt?: string;
  children: JSX.Element;
  onLongPress?: () => void;
  tapToClose?: boolean;
  onTap?: () => void;
  borderRadius?: number;
  /**
   * This value must be set when you use the Native Header.
   * e.g.
   * import { useHeaderHeight } from "@react-navigation/elements";
   * const headerHeight = useHeaderHeight();
   */
  nativeHeaderHeight?: number;
};

export const LightBox: React.FC<LightBoxProps> = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  imgLayout,
  children,
  onLongPress,
  tapToClose = true,
  onTap,
  nativeHeaderHeight = 0,
  borderRadius,
}) => {
  // Todo: add lightboxImage component.
  const [targetLayout] = useState<AnimationParams["layout"] | null>(null);

  const animatedRef = useAnimatedRef<Animated.View>();
  const opacity = useSharedValue(1);
  const lightBox = useLightBox();

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
      layout: targetLayout ??
        imgLayout ?? {
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").width,
        },
      imageElement: children,
      tapToClose,
      onTap,
      borderRadius,
    });
  };

  const tapGesture = Gesture.Tap().onEnd((_, success) => {
    if (!success) return;
    const measurements = measure(animatedRef);
    width.value = measurements!.width;
    height.value = measurements!.height;
    x.value = measurements!.pageX;
    y.value = measurements!.pageY - nativeHeaderHeight;
    runOnJS(handlePress)();
  });
  const longPressGesture = Gesture.LongPress()
    .enabled(!!onLongPress)
    .maxDistance(10)
    .onStart(() => {
      "worklet";
      if (onLongPress) {
        runOnJS(onLongPress)();
      }
    });
  return (
    //@ts-ignore
    <GestureDetector gesture={Gesture.Race(longPressGesture, tapGesture)}>
      <Animated.View style={containerStyle}>
        <Animated.View ref={animatedRef} style={styles}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
