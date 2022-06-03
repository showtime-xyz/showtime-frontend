import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgArrowTop = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 16 8" fill="none" {...props}>
    <Path
      d="M8.707.707a1 1 0 0 0-1.414 0L0 8h16L8.707.707Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgArrowTop;
