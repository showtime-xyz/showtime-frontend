import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgTransfer = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="m6 13-4 4m0 0 4 4m-4-4h19M17 3l4 4m0 0-4 4m4-4H2"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgTransfer;
