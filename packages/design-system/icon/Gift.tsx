import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgGift = (props: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M3 10v7a2 2 0 002 2h10a2 2 0 002-2v-7m-7-4v13V6zm0 0V4a2 2 0 112 2h-2zm0 0V3.5A2.5 2.5 0 107.5 6H10zm-7 4h14H3zm0 0a2 2 0 110-4h14a2 2 0 010 4H3z"
      stroke="#52525B"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgGift;
