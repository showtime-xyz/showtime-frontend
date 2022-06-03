import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgPurchased = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Z"
      fill="#27272A"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m9.999 4.001 3.682 6.11L10 12.288 6.317 10.11l3.682-6.11Zm0 11.997L6.317 10.81l3.682 2.175 3.684-2.175L10 15.999Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgPurchased;
