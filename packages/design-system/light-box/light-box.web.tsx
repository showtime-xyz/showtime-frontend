import React, { useRef } from "react";
import { StyleProp, ViewStyle } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

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
};

// Todo: support web.
export const LightBox: React.FC<LightBoxProps> = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  imgLayout,
  children,
  onLongPress,
  tapToClose = true,
  onTap,
}) => {
  const animatedRef = useRef<Animated.View>(null);
  const opacity = useSharedValue(1);

  const styles = useAnimatedStyle(() => {
    return {
      width: imgWidth,
      height: imgHeight,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={containerStyle}>
      <Animated.View ref={animatedRef} style={styles}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};
