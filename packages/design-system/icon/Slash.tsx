import * as React from "react";

import Svg, { SvgProps, Circle, Path } from "react-native-svg";

const SvgSlash = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="m4.93 4.93 14.14 14.14" />
  </Svg>
);

export default SvgSlash;
