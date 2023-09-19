import * as React from "react";

import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

const SvgDownload2 = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 20 20" {...props}>
    <G clipPath="url(#Download2_svg__a)">
      <Path
        fill={props.color}
        fillRule="evenodd"
        d="M13.615 10.307A1 1 0 1 0 12.2 11.72l3.036 3.036a1 1 0 0 0 1.414 0l3.037-3.036a1 1 0 0 0-1.414-1.414l-1.33 1.329V1a1 1 0 1 0-2 0v10.636l-1.33-1.33Z"
        clipRule="evenodd"
      />
      <Path
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 18.999h18.024M1 14.03h6.341M1 9.06h6.341M1 4.092h6.341"
      />
    </G>
    <Defs>
      <ClipPath id="Download2_svg__a">
        <Path fill={props.color} d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgDownload2;
