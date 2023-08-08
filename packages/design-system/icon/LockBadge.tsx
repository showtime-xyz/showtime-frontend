import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgLockBadge = (props: SvgProps) => (
  <Svg width="16" height="21" viewBox="0 0 16 21" fill="none" {...props}>
    <Path
      d="M13.2204 9.99951H2.94299C2.19115 9.99951 1.58167 10.6012 1.58167 11.3433V17.6556C1.58167 18.3978 2.19115 18.9995 2.94299 18.9995H13.2204C13.9722 18.9995 14.5817 18.3978 14.5817 17.6556V11.3433C14.5817 10.6012 13.9722 9.99951 13.2204 9.99951Z"
      fill={props.color}
      stroke={props.color}
      strokeWidth="2.90522"
    />
    <Path
      d="M12.4811 9.29053V6.6641C12.5016 5.20665 11.6318 2.29053 7.99216 2.29053C4.76542 2.29053 3.68444 4.58303 3.48145 6.11874"
      stroke={props.color}
      strokeWidth="4.35783"
    />
  </Svg>
);

export default SvgLockBadge;
