import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgArrowBotton = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.707 11.293a1 1 0 0 0-1.414 1.414l7 7a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0-1.414-1.414L13 16.586V5a1 1 0 1 0-2 0v11.586l-5.293-5.293Z"
      fill={props.color}
    />
  </Svg>
);

export default SvgArrowBotton;
