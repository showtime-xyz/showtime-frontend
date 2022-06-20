import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgList = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M5 7h14M5 12h14M5 17h14"
      stroke={props.color}
      strokeLinecap="round"
    />
  </Svg>
);

export default SvgList;
