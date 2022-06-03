import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgLiked = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Z"
      fill="#27272A"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.081 5.832a2.855 2.855 0 0 1 3.112 4.657L10.31 14.37a.44.44 0 0 1-.62 0L5.806 10.49A2.855 2.855 0 0 1 9.845 6.45l.155.155.155-.155c.265-.265.58-.476.926-.62Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgLiked;
