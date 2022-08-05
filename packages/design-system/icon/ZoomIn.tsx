import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgZoomIn = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="m21 21-6-6m-5-8v3m0 0v3m0-3h3m-3 0H7m10 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={props.color}
    />
  </Svg>
);

export default SvgZoomIn;
