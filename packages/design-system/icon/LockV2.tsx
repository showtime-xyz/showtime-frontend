import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgLockV2 = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 10 10" {...props}>
    <Path
      fill={props.color}
      d="M7.835 4h-5.67a.67.67 0 0 0-.665.677v3.646A.67.67 0 0 0 2.165 9h5.67a.67.67 0 0 0 .665-.677V4.677A.67.67 0 0 0 7.835 4Z"
    />
    <Path
      stroke={props.color}
      strokeWidth={1.277}
      d="M7 4.695V3.026C7.009 2.351 6.622 1 5.005 1 3.57 1 3.09 2.062 3 2.774v1.79"
    />
  </Svg>
);
export default SvgLockV2;
