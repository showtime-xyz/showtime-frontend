import * as React from "react";

import Svg, { SvgProps, Rect, Path } from "react-native-svg";

function SvgVideo(props: SvgProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 19 11"
      fill="none"
      {...props}
    >
      <Rect
        x={0.554443}
        y={0.163574}
        width={10.8191}
        height={10.8191}
        rx={1.41115}
        fill={props.color}
      />
      <Path
        d="M10.75 5.98a.47.47 0 010-.814l4.871-2.813a.47.47 0 01.706.407v5.626a.47.47 0 01-.706.407L10.75 5.98z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgVideo;
