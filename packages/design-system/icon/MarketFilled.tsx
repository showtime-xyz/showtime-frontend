import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function MarketFilled(props: SvgProps) {
  return (
    <Svg width={16} height={17} viewBox="0 0 16 17" fill="none" {...props}>
      <Path
        d="M3.488 2.073A.667.667 0 014 1.833h8c.197 0 .385.088.512.24l2 2.4a.659.659 0 01.021.027H1.466a.667.667 0 01.022-.027l2-2.4z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.333 5.833h13.333V13.3c0 .52-.23 1-.61 1.344-.38.341-.88.523-1.39.523H3.333c-.51 0-1.01-.182-1.389-.523a1.809 1.809 0 01-.611-1.344V5.833zm4.667 2a.667.667 0 10-1.334 0 3.333 3.333 0 106.667 0 .667.667 0 00-1.333 0 2 2 0 11-4 0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default MarketFilled;
