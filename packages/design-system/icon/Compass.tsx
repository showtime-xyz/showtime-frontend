import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

function SvgCompass(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.189 8.076a1 1 0 00-1.265-1.265l-6.36 2.12a1 1 0 00-.633.633l-2.12 6.36a1 1 0 001.265 1.265l6.36-2.12a1 1 0 00.633-.633l2.12-6.36zM9.34 14.66l1.33-3.988 3.988-1.33-1.33 3.988-3.988 1.33z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12a9 9 0 1118 0 9 9 0 01-18 0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgCompass;
