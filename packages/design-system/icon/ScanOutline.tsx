import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgScanOutline = (props: SvgProps) => (
  <Svg viewBox="0 0 512 512" width={24} height={24} {...props}>
    <Path
      d="M336 448h56a56 56 0 0 0 56-56v-56m0-160v-56a56 56 0 0 0-56-56h-56M176 448h-56a56 56 0 0 1-56-56v-56m0-160v-56a56 56 0 0 1 56-56h56"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
    />
  </Svg>
);

export default SvgScanOutline;
