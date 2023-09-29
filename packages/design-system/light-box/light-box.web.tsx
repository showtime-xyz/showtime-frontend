import React, { useCallback } from "react";
import { View } from "react-native";

import { LightBoxProps } from "./light-box";
import { useLightBox } from "./provider.web";

export const LightBox: React.FC<LightBoxProps> = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  children,
}) => {
  const lightBox = useLightBox();
  const newChildren = React.cloneElement(children, {
    resizeMode: "contain",
  });
  const onPress = useCallback(() => {
    lightBox?.show({
      imageElement: containerStyle ? (
        <View style={containerStyle}>{newChildren}</View>
      ) : (
        children
      ),
    });
  }, [children, containerStyle, lightBox, newChildren]);

  return (
    <div
      onClick={onPress}
      style={{
        width: imgWidth,
        height: imgHeight,
      }}
    >
      {children}
    </div>
  );
};
