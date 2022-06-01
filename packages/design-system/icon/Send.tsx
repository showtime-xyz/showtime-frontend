import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgSend = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.707 3.293a.998.998 0 0 1 .23 1.058l-6.293 17.98a1 1 0 0 1-1.858.075l-3.377-7.6a1.002 1.002 0 0 1-.216-.215l-7.6-3.377a1 1 0 0 1 .077-1.858l17.979-6.293a1 1 0 0 1 1.058.23ZM11.293 14.12l2.296 5.168 4.02-11.483-6.316 6.315Zm4.901-7.73L9.88 12.707 4.71 10.411l11.483-4.02Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgSend;
