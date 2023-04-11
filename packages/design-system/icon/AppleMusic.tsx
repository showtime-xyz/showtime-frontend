import * as React from "react";

import { Image } from "expo-image";

function SVGAppleMusic(props: { height: number; width: number }) {
  const style = {
    height: props.height ?? 24,
    width: props.width ?? 24,
  };
  return <Image source={require("./AppleMusic.svg")} style={style} />;
}

export default SVGAppleMusic;
