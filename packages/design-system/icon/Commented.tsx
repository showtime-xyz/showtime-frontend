import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgCommented = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Z"
      fill="#27272A"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 14.5a5.424 5.424 0 0 1-2.364-.534l-1.756.356a.5.5 0 0 1-.568-.664l.463-1.25A4.16 4.16 0 0 1 5 10c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5-2.239 4.5-5 4.5Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgCommented;
