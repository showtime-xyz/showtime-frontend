import * as React from "react";

import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

const SvgPieChart = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M23.92 10.158A10.93 10.93 0 0 0 14.038.274c-.55-.05-.999.403-.999.955v8.928a1 1 0 0 0 1 1h8.928c.552 0 1.005-.45.955-1Z"
    />
    <Path
      fillRule="evenodd"
      fill={props.color}
      d="M10.074 3.2c.55-.052.999.4.999.953v8.309a1 1 0 0 0 1 1h8.31c.552 0 1.004.449.951.998-.502 5.225-4.904 9.31-10.26 9.31-5.694 0-10.31-4.615-10.31-10.308 0-5.357 4.085-9.759 9.31-10.262Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgPieChart;
