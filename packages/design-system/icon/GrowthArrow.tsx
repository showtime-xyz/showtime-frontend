import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgGrowthArrow = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 25 22" {...props}>
    <Path
      fill={props.color}
      stroke={props.color}
      strokeWidth={2}
      d="M20.471 1.158H4.764a3 3 0 0 0-3 3v13.465a3 3 0 0 0 3 3h15.707a3 3 0 0 0 3-3V4.158a3 3 0 0 0-3-3Z"
    />
    <Path
      stroke={"#fff"}
      strokeLinecap="square"
      strokeWidth={2}
      d="m5.994 15.967 4.385-5.536 3.06 2.692 5.515-7.285m0 0-3.331.595m3.33-.595.34 3.333"
    />
  </Svg>
);
export default SvgGrowthArrow;
