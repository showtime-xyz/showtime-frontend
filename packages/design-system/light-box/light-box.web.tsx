import React from "react";
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

  const onPress = () => {
    lightBox?.show({
      imageElement: children,
    });
  };
  return (
    <View style={containerStyle}>
      <div
        onClick={onPress}
        style={{
          width: imgWidth,
          height: imgHeight,
        }}
      >
        {children}
      </div>
    </View>
  );
};
