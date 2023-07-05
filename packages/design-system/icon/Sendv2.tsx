import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgSendv2 = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 27 23" {...props}>
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M1.33 3.569 25.572 1.56 15.056 21.39l-4.615-10.302L1.33 3.57ZM10.346 11.125l5.707-3.38"
    />
  </Svg>
);
export default SvgSendv2;
