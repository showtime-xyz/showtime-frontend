import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgVideo(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.18 3A1.18 1.18 0 003 4.18V6h3V3H4.18zm0-2A3.18 3.18 0 001 4.18v15.64A3.18 3.18 0 004.18 23h15.64A3.18 3.18 0 0023 19.82V4.18A3.18 3.18 0 0019.82 1H4.18zM8 3v8h8V3H8zm10 0v3h3V4.18A1.18 1.18 0 0019.82 3H18zm3 5h-3v3h3V8zm0 5h-3v3h3v-3zm0 5h-3v3h1.82A1.18 1.18 0 0021 19.82V18zm-5 3v-8H8v8h8zM6 21v-3H3v1.82c0 .652.528 1.18 1.18 1.18H6zm-3-5h3v-3H3v3zm0-5h3V8H3v3z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgVideo;
