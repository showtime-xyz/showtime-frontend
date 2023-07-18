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

  const onPress = useCallback(() => {
    lightBox?.show({
      imageElement: <View style={containerStyle}>{children}</View>,
    });
  }, [children, containerStyle, lightBox]);

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
