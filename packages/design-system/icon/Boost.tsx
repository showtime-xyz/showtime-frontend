import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgBoost = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.707 5.293a1 1 0 0 0-1.414 0l-5 5a1 1 0 1 0 1.414 1.414L12 7.414l4.293 4.293a1 1 0 0 0 1.414-1.414l-5-5Zm5 12-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 1 0 1.414 1.414L12 14.414l4.293 4.293a1 1 0 0 0 1.414-1.414Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgBoost;
