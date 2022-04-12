import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgBasket = (props: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M6.172 2.199 3.038 5.333H4.96L7.134 3.16a.68.68 0 0 0-.961-.961ZM12.961 5.333h-1.922L8.866 3.16a.68.68 0 0 1 .961-.961l3.134 3.134ZM1.333 7.333v.462h.357c.297 0 .567.171.698.442L4.666 14h6.667l2.279-5.762a.775.775 0 0 1 .698-.443h.356v-.462A.667.667 0 0 0 14 6.667H2a.667.667 0 0 0-.667.666Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgBasket;
