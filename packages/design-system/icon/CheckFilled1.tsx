import * as React from "react";

import Svg, { SvgProps, Circle, Path } from "react-native-svg";

const SvgCheckFilled1 = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 20 20" fill="none" {...props}>
    <Circle cx={10} cy={10} r={10} fill={props.fill || "#F5F4F6"} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.478 5.15a.833.833 0 0 1 .205 1.161l-5.834 8.334a.833.833 0 0 1-1.272.11l-3.333-3.332a.833.833 0 1 1 1.179-1.179l2.63 2.631 5.264-7.52a.833.833 0 0 1 1.16-.204Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgCheckFilled1;
