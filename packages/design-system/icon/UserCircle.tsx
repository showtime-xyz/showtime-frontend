import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgUserCircle = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M5.121 17.804A13.936 13.936 0 0 1 12 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgUserCircle;
