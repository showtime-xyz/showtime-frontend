import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgBellOff = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M0 0h24v24H0z" stroke="none" />
    <Path d="m3 3 18 18M17 17H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 1.279-3.716M9.351 5.35c.209-.127.425-.244.649-.35a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3" />
    <Path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </Svg>
);

export default SvgBellOff;
