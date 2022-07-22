import React from "react";

import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { LightBoxProps } from "./light-box";
import { useLightBox } from "./provider.web";

export const LightBox: React.FC<LightBoxProps> = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  children,
}) => {
  const lightBox = useLightBox();
  const styles = useAnimatedStyle(() => {
    return {
      width: imgWidth,
      height: imgHeight,
    };
  });

  const onPress = () => {
    lightBox?.show({
      imageElement: children,
    });
  };
  return (
    <Animated.View style={containerStyle}>
      <div onClick={onPress} style={styles}>
        {children}
      </div>
    </Animated.View>
  );
};
