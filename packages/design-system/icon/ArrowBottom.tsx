import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgArrow = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 16 8" fill="none" {...props}>
    <Path
      d="M7.293 7.293a1 1 0 0 0 1.414 0L16 0H0l7.293 7.293Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgArrow;
