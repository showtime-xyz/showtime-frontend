import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgFollowed = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Z"
      fill="#27272A"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 6.5a1 1 0 1 0-2 0V9H6.5a1 1 0 0 0 0 2H9v2.5a1 1 0 1 0 2 0V11h2.5a1 1 0 1 0 0-2H11V6.5Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgFollowed;
