import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgCompassFilled(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M9.341 14.659l1.33-3.988 3.988-1.33-1.33 3.988-3.988 1.33z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm16.189-3.924a1 1 0 00-1.265-1.265l-6.36 2.12a1 1 0 00-.633.633l-2.12 6.36a1 1 0 001.265 1.265l6.36-2.12a1 1 0 00.633-.633l2.12-6.36z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgCompassFilled;
