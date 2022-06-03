import React from "react";
import { Image } from "react-native";

import { MenuDisplayName, MenuItemImageProps } from "@zeego/menu";

const ItemImage = ({
  source,
  style,
  height,
  width,
  fadeDuration = 0,
  resizeMode,
}: MenuItemImageProps) => {
  return (
    <Image
      resizeMode={resizeMode}
      fadeDuration={fadeDuration}
      style={style}
      source={source}
      width={width}
      height={height}
    />
  );
};

ItemImage.displayName = MenuDisplayName.ItemImage;

export { ItemImage };
