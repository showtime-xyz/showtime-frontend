import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgDarkMode = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19.426 4.575a10.499 10.499 0 1 0-14.849 14.85 10.5 10.5 0 1 0 14.849-14.85ZM12.002 20.25v-4.5a3.75 3.75 0 1 1 0-7.5v-4.5c4.549 0 8.25 3.703 8.25 8.25 0 4.547-3.701 8.25-8.25 8.25Z"
      fill={props.color}
    />
    <Path
      d="M15.752 12a3.75 3.75 0 0 0-3.75-3.75v7.5a3.75 3.75 0 0 0 3.75-3.75Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgDarkMode;
