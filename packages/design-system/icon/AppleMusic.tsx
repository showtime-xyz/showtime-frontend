import * as React from "react";
import { Platform } from "react-native";

import { Image } from "expo-image";

function SVGAppleMusic(props: { height: number; width: number }) {
  return (
    <Image
      style={{ height: props.height ?? 24, width: props.width ?? 24 }}
      source={
        Platform.OS === "web"
          ? { uri: require("./AppleMusic.svg") }
          : require("./AppleMusic.svg")
      }
      {...props}
    />
  );
}

export default SVGAppleMusic;
