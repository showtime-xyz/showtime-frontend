import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgPauseOutline = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8 4h.8v16H8V4Zm7.2 0h.8v16h-.8V4Z"
      stroke={props.stroke || props.color}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgPauseOutline;
