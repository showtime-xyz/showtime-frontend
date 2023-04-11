import * as React from "react";

function SVGAppleMusic(props: { height: number; width: number }) {
  const style = {
    height: props.height ?? 24,
    width: props.width ?? 24,
  };
  return <img src={require("./AppleMusic.svg")} style={style} />;
}

export default SVGAppleMusic;
