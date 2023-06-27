import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgCheck2 = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 18 18" fill="none" {...props}>
    <Path
      d="m1.499 10.752 5.563 5.563 9.187-14.438"
      stroke={props.color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgCheck2;
