import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgUnlocked = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 14 14" {...props}>
    <Path
      fill={props.color}
      stroke={props.color}
      strokeWidth={1.099}
      d="M8.126 6H1.748A.748.748 0 0 0 1 6.748v5.07c0 .413.335.748.748.748h6.378a.748.748 0 0 0 .747-.747V6.748A.748.748 0 0 0 8.126 6Z"
    />
    <Path
      stroke={props.color}
      strokeWidth={1.649}
      d="M6.843 6.201V3.92c-.013-.923.516-2.77 2.727-2.77 1.961 0 2.742 1.583 2.742 2.77v1.233"
    />
  </Svg>
);
export default SvgUnlocked;
