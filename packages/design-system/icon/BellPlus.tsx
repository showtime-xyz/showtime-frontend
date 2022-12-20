import * as React from "react";

import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

const SvgBellPlus = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <G
      clipPath="url(#BellPlus_svg__a)"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M13.414 3.586A2 2 0 0 0 10 5a7 7 0 0 0-4 6v3a4 4 0 0 1-2 3h16a4 4 0 0 1-2-3v-1.5M9 17v1a3 3 0 0 0 6 0v-1M15 6h6M18 3v6" />
    </G>
    <Defs>
      <ClipPath id="BellPlus_svg__a">
        <Path fill={props.color} d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SvgBellPlus;
