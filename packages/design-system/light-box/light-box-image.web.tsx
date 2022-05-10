import React, { useRef } from "react";

import { Image } from "../image";
import { View } from "../view";
import { LightImageProps } from "./light-box-image";

// Todo: support web.
export const LightBoxImg = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  alt = "",
  ...rest
}: LightImageProps) => {
  const ref = useRef<HTMLElement | null>(null);

  return (
    <View style={containerStyle}>
      <View ref={ref}>
        <Image width={imgWidth} height={imgHeight} alt={alt} {...rest} />
      </View>
    </View>
  );
};
